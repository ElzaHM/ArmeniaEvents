import {GoogleGenerativeAI, GoogleGenerativeAIFetchError} from "@google/generative-ai";

import {
  buildAdminGoogleSearchUrl,
  isValidAdminTicketUrl,
  sanitizeAdminImageUrl,
} from "../../components/admin/mapApiEventToAdminEvent";
import {supabase} from "../../lib/supabase";

function getSanitizedGeminiKey(): string {
  const rawKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  return rawKey.replace(/['"]+/g, "").trim();
}

const GEMINI_MODEL = "gemini-2.5-flash";

export const GEMINI_BUSY_RETRY_MESSAGE =
  "Google servers are busy. Retrying in 10 seconds...";

export const GEMINI_UNAVAILABLE_MESSAGE =
  "AI service is currently busy. Please try again in a few seconds.";

export const GEMINI_AUTH_MISSING_MESSAGE =
  "Missing VITE_GEMINI_API_KEY. Add your Gemini API key to .env.local and restart the dev server.";

export const GEMINI_AUTH_REJECTED_MESSAGE =
  "API Key Rejected. Please check if your Google AI Studio key is active and correctly pasted in .env without quotes.";

export const GEMINI_PARSE_ERROR_MESSAGE =
  "AI returned incompatible data format. Please try again.";

/** @deprecated Use GEMINI_AUTH_MISSING_MESSAGE or GEMINI_AUTH_REJECTED_MESSAGE */
export const GEMINI_AUTH_ERROR_MESSAGE = GEMINI_AUTH_REJECTED_MESSAGE;

const VALID_AI_CATEGORIES = [
  "Science",
  "Education",
  "Lifestyle",
  "Food & Drink",
  "Art",
  "Entertainment",
  "Business",
  "Tech",
  "Society",
  "Family",
] as const;

type CanonicalCategory = (typeof VALID_AI_CATEGORIES)[number];

const BASE_AI_PROMPT = `Search Google for 10 REAL and VERIFIED upcoming events in Armenia for 2026.

For each event provide: title, description, venue, address, start_date (ISO 8601), source (website or organizer name), category_name, source_url, and ticket_url when available.

CRITICAL — category_name rules:
- The category_name must be exactly one of these 10 categories (copy the name exactly, including capitalization and punctuation):
  - Science
  - Education
  - Lifestyle
  - Food & Drink
  - Art
  - Entertainment
  - Business
  - Tech
  - Society
  - Family
- CRITICAL - The category_name must be exactly one of the 10 categories listed above. Do NOT combine categories (e.g., do NOT generate 'Business & Tech' or 'Lifestyle & Food'). Choose the single most appropriate category from the list above depending on the event's main focus.

CRITICAL — source_url rules:
- DO NOT provide grounding or technical links from google.com (no google.com/grounding-api-redirect URLs).
- Provide the ORIGINAL official website URL of the event or venue (e.g. https://opera.am or https://ticketon.am).
- If you cannot find the exact event page, provide the official Facebook or Instagram page of the organizer.
- Never use example.com or placeholder URLs.

image_url may be omitted — images are assigned automatically.

Your entire response must be a valid JSON array. Do not add any intro or outro text.`;

function getAiPrompt(existingTitles: string[]): string {
  if (existingTitles.length === 0) {
    return BASE_AI_PROMPT;
  }

  return `${BASE_AI_PROMPT}

CRITICAL - Do NOT generate duplicates. We already have these events in our database: [${existingTitles.join(", ")}]. Do NOT generate any events that are identical or semantically highly similar to these. For example, if the list contains 'Yerevan Beer Days' and you find 'Yerevan Beer Days 2026', do NOT generate it.`;
}

/** Google Search grounding tool (API expects google_search, not googleSearchRetrieval). */
function getGoogleSearchTools(): import("@google/generative-ai").Tool[] {
  return [{google_search: {}} as unknown as import("@google/generative-ai").Tool];
}

/** Maps legacy or synonym labels to canonical Supabase category keys (lowercase). */
const CATEGORY_ALIASES: Record<string, string[]> = {
  science: ["scientific", "research", "stem", "laboratory", "physics", "chemistry", "biology"],
  education: [
    "learning",
    "workshop",
    "seminar",
    "training",
    "lecture",
    "course",
    "school",
    "university",
    "academic",
  ],
  lifestyle: [
    "wellness",
    "fashion",
    "beauty",
    "fitness",
    "yoga",
    "health",
    "sport",
    "sports",
    "outdoors",
    "hiking",
    "match",
    "athletics",
  ],
  "food & drink": [
    "food",
    "drink",
    "culinary",
    "restaurant",
    "wine",
    "beer",
    "gastronomy",
    "cooking",
    "dining",
  ],
  art: [
    "arts",
    "gallery",
    "museum",
    "exhibition",
    "exhibitions",
    "painting",
    "sculpture",
    "photography",
    "craft",
    "cultural",
    "heritage",
    "culture",
  ],
  entertainment: [
    "concert",
    "concerts",
    "music",
    "live music",
    "jazz",
    "symphony",
    "theater",
    "theatre",
    "opera",
    "drama",
    "performing arts",
    "ballet",
    "play",
    "festival",
    "festivals",
    "film",
    "cinema",
    "movie",
    "comedy",
    "show",
    "celebration",
  ],
  business: ["corporate", "networking", "entrepreneur", "finance", "economy", "trade"],
  tech: ["technology", "expo", "meetup", "software", "digital", "innovation", "startup"],
  society: ["community", "charity", "social", "civic", "general", "misc", "other", "uncategorized"],
  family: ["kids", "children", "parenting", "family-friendly", "youth"],
};

type AiEventRaw = {
  title?: string;
  description?: string;
  image_url?: string;
  imageUrl?: string;
  start_date?: string;
  startDate?: string;
  venue?: string;
  address?: string;
  source?: string;
  source_website?: string;
  source_url?: string;
  sourceUrl?: string;
  ticket_url?: string;
  ticketUrl?: string;
  ticket_link?: string;
  category?: string;
  category_name?: string;
};

type EventUpsertRow = {
  title: string;
  description: string | null;
  image_url: string | null;
  venue: string | null;
  address: string | null;
  start_date: string;
  end_date: string | null;
  ticket_url: string | null;
  category_id: string | null;
  organizer_id: string | null;
  status: "published";
  views: number;
  source: string;
  external_id: string;
  source_url: string | null;
};

/** Allowed Supabase `events` columns — prevents PGRST204 schema mismatches. */
const EVENTS_UPSERT_KEYS: (keyof EventUpsertRow)[] = [
  "title",
  "description",
  "image_url",
  "venue",
  "address",
  "start_date",
  "end_date",
  "ticket_url",
  "category_id",
  "organizer_id",
  "status",
  "views",
  "source",
  "external_id",
  "source_url",
];

function sanitizeEventUpsertRow(row: EventUpsertRow): EventUpsertRow {
  const sanitized: Record<string, any> = {};

  for (const key of EVENTS_UPSERT_KEYS) {
    sanitized[key] = row[key];
  }

  return sanitized as EventUpsertRow;
}

function mapNormalizedEventToUpsertRow(
  event: NonNullable<ReturnType<typeof normalizeAiEvent>>,
  categoryId: string | null,
  organizerId: string | null,
  external_id: string,
): EventUpsertRow {
  return sanitizeEventUpsertRow({
    title: event.title.trim(),
    description: event.description.trim(),
    image_url: event.image_url,
    venue: event.venue.trim(),
    address: event.address?.trim() ?? null,
    start_date: event.start_date,
    end_date: null,
    ticket_url: event.ticket_url,
    category_id: categoryId,
    organizer_id: organizerId,
    status: "published",
    views: 0,
    source: event.source.trim(),
    external_id,
    source_url: event.source_url,
  });
}

type CategoryRow = {
  id: string;
  name: string;
};

type OrganizerRow = {
  id: string;
  name: string;
};

export type AiSyncResult = {
  imported: number;
  total: number;
};

export type AiSyncOptions = {
  onRetry?: (message: string) => void;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isGemini503Error(error: unknown): boolean {
  if (error instanceof GoogleGenerativeAIFetchError && error.status === 503) {
    return true;
  }

  const message = (error instanceof Error ? error.message : String(error)).toLowerCase();

  return (
    message.includes("503") ||
    message.includes("service unavailable") ||
    message.includes("high demand") ||
    message.includes("overloaded")
  );
}

export class GeminiAuthError extends Error {
  constructor(message = GEMINI_AUTH_REJECTED_MESSAGE) {
    super(message);
    this.name = "GeminiAuthError";
  }
}

export class GeminiServiceUnavailableError extends Error {
  constructor(message = GEMINI_UNAVAILABLE_MESSAGE) {
    super(message);
    this.name = "GeminiServiceUnavailableError";
  }
}

export class GeminiParseError extends Error {
  constructor(message = GEMINI_PARSE_ERROR_MESSAGE) {
    super(message);
    this.name = "GeminiParseError";
  }
}

export function isGeminiAuthError(error: unknown): boolean {
  if (error instanceof GeminiAuthError) {
    return true;
  }

  if (error instanceof GoogleGenerativeAIFetchError && error.status === 401) {
    return true;
  }

  const message = (error instanceof Error ? error.message : String(error)).toLowerCase();

  return (
    message.includes("401") ||
    message.includes("unauthenticated") ||
    message.includes("access_token_type_unsupported") ||
    message.includes("api key not valid") ||
    message.includes("invalid api key")
  );
}

export function isGeminiUnavailableError(error: unknown): boolean {
  if (isGeminiAuthError(error)) {
    return false;
  }

  if (error instanceof GeminiServiceUnavailableError) {
    return true;
  }

  if (error instanceof GoogleGenerativeAIFetchError) {
    return error.status === 404 || error.status === 429 || error.status === 503;
  }

  const message = (error instanceof Error ? error.message : String(error)).toLowerCase();

  return (
    message.includes("404") ||
    message.includes("429") ||
    message.includes("503") ||
    message.includes("not found") ||
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("limit: 0") ||
    message.includes("resource exhausted") ||
    message.includes("too many requests")
  );
}

export function getAiSyncErrorMessage(error: unknown): string {
  if (error instanceof GeminiAuthError) {
    return error.message;
  }

  if (isGeminiAuthError(error)) {
    return error instanceof GeminiAuthError ? error.message : GEMINI_AUTH_REJECTED_MESSAGE;
  }

  if (error instanceof GeminiServiceUnavailableError) {
    return error.message;
  }

  if (error instanceof GeminiParseError) {
    return error.message;
  }

  if (isGeminiUnavailableError(error)) {
    return GEMINI_UNAVAILABLE_MESSAGE;
  }

  return error instanceof Error ? error.message : "AI event fetch failed";
}

function toGeminiServiceError(error: unknown): Error {
  if (isGeminiAuthError(error)) {
    const message = (error instanceof Error ? error.message : String(error)).toLowerCase();
    const isRejectedByApi =
      (error instanceof GoogleGenerativeAIFetchError && error.status === 401) ||
      message.includes("401") ||
      message.includes("access_token_type_unsupported") ||
      message.includes("api key not valid") ||
      message.includes("invalid api key");

    return new GeminiAuthError(
      isRejectedByApi ? GEMINI_AUTH_REJECTED_MESSAGE : GEMINI_AUTH_MISSING_MESSAGE,
    );
  }

  if (isGeminiUnavailableError(error)) {
    return new GeminiServiceUnavailableError();
  }

  return error instanceof Error ? error : new Error("Failed to fetch events from Gemini.");
}

function assertSupabaseConfig(): void {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    throw new Error(
      "Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }
}

function assertGeminiConfig(): string {
  const sanitizedKey = getSanitizedGeminiKey();

  if (!sanitizedKey) {
    throw new GeminiAuthError(GEMINI_AUTH_MISSING_MESSAGE);
  }

  return sanitizedKey;
}

function extractJsonArray(text: string): AiEventRaw[] {
  try {
    const trimmed = text.trim();
    const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    const stripped = fenceMatch ? fenceMatch[1].trim() : trimmed;
    const jsonMatch = stripped.match(/\[[\s\S]*\]/);
    const cleanJson = jsonMatch ? jsonMatch[0] : stripped;

    const parsed = JSON.parse(cleanJson);

    if (!Array.isArray(parsed)) {
      throw new GeminiParseError();
    }

    return parsed as AiEventRaw[];
  } catch (error) {
    if (error instanceof GeminiParseError) {
      throw error;
    }

    throw new GeminiParseError();
  }
}

/** Strips years, punctuation, and casing so near-duplicate titles share the same hash. */
function normalizeTitleForHash(title: string): string {
  let normalized = title.toLowerCase();

  normalized = normalized.replace(/\b(19|20)\d{2}\b/g, " ");
  normalized = normalized.replace(/[^a-z0-9\u0531-\u058f\u0400-\u04ff\s]/g, " ");
  normalized = normalized.replace(/\s+/g, " ").trim();

  return normalized;
}

async function hashTitle(title: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(title.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return `ai_${hashHex.slice(0, 16)}`;
}

type ExistingEventTitleRow = {
  title: string;
};

async function loadExistingEventTitles(): Promise<string[]> {
  const {data: existingEvents, error} = await supabase.from("events").select("title");

  if (error) {
    throw new Error(error.message);
  }

  return ((existingEvents ?? []) as ExistingEventTitleRow[])
    .map((event) => event.title?.trim())
    .filter((title): title is string => Boolean(title));
}

async function loadCategoryLookup(): Promise<{
  byName: Map<string, string>;
  defaultId: string | null;
}> {
  const {data, error} = await supabase.from("categories").select("id, name");

  if (error) {
    throw new Error(error.message);
  }

  const byName = new Map<string, string>();

  for (const row of (data ?? []) as CategoryRow[]) {
    byName.set(row.name.trim().toLowerCase(), row.id);
  }

  const defaultId =
    byName.get("society") ??
    byName.get("entertainment") ??
    (data?.[0] as CategoryRow | undefined)?.id ??
    null;

  return {byName, defaultId};
}

function resolveCategoryId(
  categoryName: string,
  lookup: {byName: Map<string, string>; defaultId: string | null},
): string | null {
  const normalized = categoryName.trim().toLowerCase();

  if (!normalized) {
    return lookup.defaultId;
  }

  // 1. Exact case-insensitive match against Supabase category names.
  if (lookup.byName.has(normalized)) {
    return lookup.byName.get(normalized) ?? lookup.defaultId;
  }

  // 2. Combined labels (e.g. "Business & Tech") — try each segment as an exact match.
  const segments = normalized
    .split(/\s*(?:&|\/|,|\band\b|\+)\s*/i)
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length > 1) {
    for (const segment of segments) {
      if (lookup.byName.has(segment)) {
        return lookup.byName.get(segment) ?? lookup.defaultId;
      }
    }
  }

  // 3. Legacy/synonym aliases mapped to the 10 canonical categories.
  for (const [canonical, aliases] of Object.entries(CATEGORY_ALIASES)) {
    const canonicalKey = canonical.toLowerCase();
    const matchesCanonical =
      normalized === canonicalKey ||
      aliases.some((alias) => normalized === alias.toLowerCase());

    if (matchesCanonical && lookup.byName.has(canonicalKey)) {
      return lookup.byName.get(canonicalKey) ?? lookup.defaultId;
    }
  }

  // 4. Token-level exact match (e.g. "tech expo" → "tech").
  const words = normalized.split(/[\s,/|+-]+/).filter((word) => word.length > 2);
  for (const word of words) {
    if (lookup.byName.has(word)) {
      return lookup.byName.get(word) ?? lookup.defaultId;
    }

    for (const [canonical, aliases] of Object.entries(CATEGORY_ALIASES)) {
      const canonicalKey = canonical.toLowerCase();
      if (
        word === canonicalKey ||
        aliases.some((alias) => word === alias.toLowerCase())
      ) {
        if (lookup.byName.has(canonicalKey)) {
          return lookup.byName.get(canonicalKey) ?? lookup.defaultId;
        }
      }
    }
  }

  return lookup.defaultId;
}

async function loadOrganizerLookup(): Promise<Map<string, string>> {
  const {data, error} = await supabase.from("organizers").select("id, name");

  if (error) {
    throw new Error(error.message);
  }

  const byName = new Map<string, string>();

  for (const row of (data ?? []) as OrganizerRow[]) {
    byName.set(row.name.trim().toLowerCase(), row.id);
  }

  return byName;
}

async function resolveOrCreateOrganizerId(
  organizerName: string,
  lookup: Map<string, string>,
): Promise<string | null> {
  const normalized = organizerName.trim();

  if (!normalized) {
    return null;
  }

  const key = normalized.toLowerCase();

  if (lookup.has(key)) {
    return lookup.get(key) ?? null;
  }

  const {data: existing} = await supabase
    .from("organizers")
    .select("id")
    .ilike("name", normalized)
    .limit(1)
    .maybeSingle();

  if (existing) {
    lookup.set(key, existing.id);
    return existing.id;
  }

  const {data: created, error} = await supabase
    .from("organizers")
    .insert({name: normalized})
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  lookup.set(key, created.id);
  return created.id;
}

function findCanonicalByKey(key: string): CanonicalCategory | null {
  const normalizedKey = key.trim().toLowerCase();

  for (const canonical of VALID_AI_CATEGORIES) {
    if (canonical.toLowerCase() === normalizedKey) {
      return canonical;
    }
  }

  return null;
}

function resolveCanonicalCategoryName(categoryName: string): CanonicalCategory {
  const normalized = categoryName.trim().toLowerCase();

  if (!normalized) {
    return "Society";
  }

  const exactMatch = findCanonicalByKey(normalized);
  if (exactMatch) {
    return exactMatch;
  }

  const segments = normalized
    .split(/\s*(?:&|\/|,|\band\b|\+)\s*/i)
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length > 1) {
    for (const segment of segments) {
      const segmentMatch = findCanonicalByKey(segment);
      if (segmentMatch) {
        return segmentMatch;
      }
    }
  }

  for (const [canonical, aliases] of Object.entries(CATEGORY_ALIASES)) {
    const matchesCanonical =
      normalized === canonical ||
      aliases.some((alias) => normalized === alias.toLowerCase());

    if (matchesCanonical) {
      return findCanonicalByKey(canonical) ?? "Society";
    }
  }

  const words = normalized.split(/[\s,/|+-]+/).filter((word) => word.length > 2);
  for (const word of words) {
    const wordMatch = findCanonicalByKey(word);
    if (wordMatch) {
      return wordMatch;
    }

    for (const [canonical, aliases] of Object.entries(CATEGORY_ALIASES)) {
      if (word === canonical || aliases.some((alias) => word === alias.toLowerCase())) {
        return findCanonicalByKey(canonical) ?? "Society";
      }
    }
  }

  return "Society";
}

function inferCategoryNameFromContent(event: AiEventRaw): CanonicalCategory {
  const haystack = `${event.title ?? ""} ${event.description ?? ""}`.toLowerCase();

  if (
    /concert|music|jazz|symphony|band|theater|theatre|opera|ballet|play|drama|festival|fest\b|film|cinema|comedy|show/.test(
      haystack,
    )
  ) {
    return "Entertainment";
  }
  if (/exhibition|gallery|museum|painting|sculpture|\bart\b/.test(haystack)) {
    return "Art";
  }
  if (/food|wine|beer|restaurant|culinary|gastronomy|cooking|dining/.test(haystack)) {
    return "Food & Drink";
  }
  if (/tech|technology|software|digital|hackathon|startup/.test(haystack)) {
    return "Tech";
  }
  if (/business|corporate|entrepreneur|networking|finance/.test(haystack)) {
    return "Business";
  }
  if (/education|workshop|seminar|training|lecture|course|school|university/.test(haystack)) {
    return "Education";
  }
  if (/science|research|stem|laboratory|physics|chemistry|biology/.test(haystack)) {
    return "Science";
  }
  if (/kids|children|family|youth|parenting/.test(haystack)) {
    return "Family";
  }
  if (/wellness|fitness|yoga|sport|hiking|lifestyle|fashion|beauty/.test(haystack)) {
    return "Lifestyle";
  }

  return "Society";
}

function inferCategoryName(event: AiEventRaw): CanonicalCategory {
  const explicit = (event.category_name ?? event.category)?.trim();

  if (explicit) {
    return resolveCanonicalCategoryName(explicit);
  }

  return inferCategoryNameFromContent(event);
}

function isGroundingOrTechnicalSourceUrl(url: string): boolean {
  const lower = url.toLowerCase();

  return (
    lower.includes("google.com/grounding") ||
    lower.includes("grounding-api-redirect") ||
    lower.includes("vertexaisearch.cloud.google.com") ||
    lower.includes("generativelanguage.googleapis.com")
  );
}

function resolveAiSourceUrl(rawUrl: string | undefined, title: string): string {
  const trimmed = rawUrl?.trim();

  if (trimmed && !isGroundingOrTechnicalSourceUrl(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (["http:", "https:"].includes(parsed.protocol) && !parsed.hostname.includes("example.com")) {
        return trimmed;
      }
    } catch {
      // fall through to search fallback
    }
  }

  return buildAdminGoogleSearchUrl(title);
}

function normalizeAiEvent(raw: AiEventRaw): {
  title: string;
  description: string;
  image_url: string | null;
  start_date: string;
  venue: string;
  address: string | null;
  source: string;
  ticket_url: string | null;
  source_url: string | null;
  category_name: string;
} | null {
  const title = raw.title?.trim();
  const description = raw.description?.trim();
  const start_date = (raw.start_date ?? raw.startDate)?.trim();
  const venue = raw.venue?.trim();
  const source = (raw.source ?? raw.source_website)?.trim() || "Gemini AI";
  const category_name = inferCategoryName(raw);
  const rawImage = (raw.image_url ?? raw.imageUrl)?.trim();
  const image_url = sanitizeAdminImageUrl(rawImage);
  const rawTicket = (raw.ticket_url ?? raw.ticketUrl ?? raw.ticket_link)?.trim();
  const ticket_url = isValidAdminTicketUrl(rawTicket) ? rawTicket! : null;
  const rawSourceUrl = (raw.source_url ?? raw.sourceUrl)?.trim();
  const source_url = resolveAiSourceUrl(rawSourceUrl ?? "", title ?? "");

  if (!title || !description || !start_date || !venue) {
    return null;
  }

  const parsedDate = new Date(start_date);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return {
    title,
    description,
    image_url,
    start_date: parsedDate.toISOString(),
    venue,
    address: raw.address?.trim() ?? null,
    source,
    ticket_url,
    source_url,
    category_name,
  };
}

function assertValidAiEventArray(events: unknown): asserts events is AiEventRaw[] {
  if (!Array.isArray(events) || events.length === 0) {
    throw new GeminiParseError();
  }
}

async function insertNewAiEvents(rows: EventUpsertRow[]): Promise<void> {
  if (rows.length === 0) {
    return;
  }

  const payload = rows.map(sanitizeEventUpsertRow);

  const {error} = await supabase.from("events").insert(payload as any);

  if (error) {
    throw new Error(error.message);
  }
}

async function requestAiEventsFromGemini(): Promise<AiEventRaw[]> {
  const sanitizedKey = assertGeminiConfig();
  const existingTitles = await loadExistingEventTitles();
  const prompt = getAiPrompt(existingTitles);
  const genAI = new GoogleGenerativeAI(sanitizedKey);
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    tools: getGoogleSearchTools(),
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  if (!text.trim()) {
    throw new GeminiServiceUnavailableError();
  }

  const events = extractJsonArray(text);
  assertValidAiEventArray(events);

  return events;
}

export async function fetchEventsWithAI(options?: AiSyncOptions): Promise<AiEventRaw[]> {
  try {
    return await requestAiEventsFromGemini();
  } catch (error) {
    if (error instanceof GeminiParseError) {
      throw error;
    }

    if (isGemini503Error(error)) {
      options?.onRetry?.(GEMINI_BUSY_RETRY_MESSAGE);
      await sleep(10_000);

      try {
        return await requestAiEventsFromGemini();
      } catch (retryError) {
        if (retryError instanceof GeminiParseError) {
          throw retryError;
        }

        throw toGeminiServiceError(retryError);
      }
    }

    throw toGeminiServiceError(error);
  }
}

export async function syncLiveAiEvents(options?: AiSyncOptions): Promise<AiSyncResult> {
  assertSupabaseConfig();

  const rawEvents = await fetchEventsWithAI(options);
  assertValidAiEventArray(rawEvents);

  const normalizedEvents = rawEvents
    .map(normalizeAiEvent)
    .filter((event): event is NonNullable<typeof event> => event !== null);

  if (normalizedEvents.length === 0) {
    throw new GeminiParseError();
  }

  const [categoryLookup, organizerLookup] = await Promise.all([
    loadCategoryLookup(),
    loadOrganizerLookup(),
  ]);

  const rows: EventUpsertRow[] = [];

  for (const event of normalizedEvents) {
    const normalizedTitle = normalizeTitleForHash(event.title);
    const hashInput = normalizedTitle || event.title.trim().toLowerCase();
    const external_id = await hashTitle(hashInput);
    const categoryId = resolveCategoryId(event.category_name, categoryLookup);
    const organizerId = await resolveOrCreateOrganizerId(event.source, organizerLookup);

    rows.push(
      mapNormalizedEventToUpsertRow(event, categoryId, organizerId, external_id),
    );
  }

  if (rows.length === 0) {
    throw new GeminiParseError();
  }

  const externalIds = rows.map((row) => row.external_id);
  const {data: existingRows, error: existingError} = await (supabase as any)
    .from("events")
    .select("external_id")
    .in("external_id", externalIds);

  if (existingError) {
    throw new Error(existingError.message);
  }

  type ExistingExternalIdRow = {
    external_id: string;
  };
  
  const existingIds = new Set(
    ((existingRows ?? []) as ExistingExternalIdRow[]).map(
      (row) => row.external_id
    )
  );
  const newRows = rows.filter((row) => !existingIds.has(row.external_id));

  if (newRows.length === 0) {
    return {
      imported: 0,
      total: rows.length,
    };
  }

  await insertNewAiEvents(newRows);

  return {
    imported: newRows.length,
    total: rows.length,
  };
}
