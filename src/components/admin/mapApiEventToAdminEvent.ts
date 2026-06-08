import type { SyntheticEvent } from 'react';

import createEventDefault from '../../assets/createEventDefault.png';
import { parseEventDate } from '../events/eventDateUtils';
import type { EventItem } from '../home/types';
import { supabase } from '../../lib/supabase';
import type { AdminEvent, AdminEventStatus } from './types';

const EVENT_IMAGES_BUCKET =
  import.meta.env.VITE_SUPABASE_EVENT_IMAGES_BUCKET ?? 'EVENT_IMAGES_BUCKET';

const IMAGE_FALLBACK_APPLIED_ATTR = 'data-image-fallback-applied';

/** Bundled default image — reliable offline fallback for broken or missing URLs. */
export const EVENT_IMAGE_PLACEHOLDER = createEventDefault;

/** Legacy Unsplash URLs stored in DB that often fail to load in the admin UI. */
const LEGACY_BROKEN_PLACEHOLDER_URLS = [
  'images.unsplash.com/photo-1565008576549',
  'images.unsplash.com/photo-1540575467063',
];

export const DEFAULT_FALLBACK_IMAGE = EVENT_IMAGE_PLACEHOLDER;

const ADMIN_LINK_BLOCKLIST = [
  'example.com',
  'placeholder',
  'yoursite.com',
  'your-site.com',
  'website.com',
  'domain.com',
  'ticket-link',
  'fake',
  'lorem',
  'javascript:',
  'localhost',
  'grounding-api-redirect',
  'vertexaisearch.cloud.google.com',
  'generativelanguage.googleapis.com',
  '#',
];

/** Raw event shape from Supabase admin queries. */
export type ApiEventRow = {
  id: string;
  title: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
  address?: string | null;
  venue?: string | null;
  status?: AdminEventStatus | null;
  views?: number | null;
  source?: string | null;
  source_url?: string | null;
  external_id?: string | null;
  ticket_url?: string | null;
  price?: number | null;
  language?: string | null;
  age_range?: string | null;
  tags?: string[] | null;
  event_type?: string | null;
  categories?: { name: string } | null;
  organizers?: { name: string; avatar_url?: string | null } | null;
};

function getRawImageUrl(row: Pick<ApiEventRow, 'image_url' | 'imageUrl'>): string {
  return row.image_url?.trim() || row.imageUrl?.trim() || '';
}

function isLegacyBrokenPlaceholderUrl(imageUrl: string): boolean {
  const lower = imageUrl.toLowerCase();
  return LEGACY_BROKEN_PLACEHOLDER_URLS.some((fragment) => lower.includes(fragment));
}

/**
 * Resolves the stored image reference to a browser-loadable URL.
 * Database value always wins; placeholder is used only when empty.
 */
export function resolveStoredEventImageUrl(imageUrl?: string | null): string {
  const trimmed = imageUrl?.trim();

  if (!trimmed) {
    return EVENT_IMAGE_PLACEHOLDER;
  }

  if (isLegacyBrokenPlaceholderUrl(trimmed)) {
    return EVENT_IMAGE_PLACEHOLDER;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const storagePath = trimmed.replace(/^\/+/, '');
  const { data } = supabase.storage.from(EVENT_IMAGES_BUCKET).getPublicUrl(storagePath);

  return data.publicUrl || EVENT_IMAGE_PLACEHOLDER;
}

/** @alias resolveStoredEventImageUrl */
export function resolveAdminEventImageUrl(imageUrl?: string | null): string {
  return resolveStoredEventImageUrl(imageUrl);
}

/** Normalizes an image URL before persisting to Supabase (never writes display placeholders). */
export function sanitizeAdminImageUrl(imageUrl?: string | null): string | null {
  const trimmed = imageUrl?.trim();

  if (!trimmed || isLegacyBrokenPlaceholderUrl(trimmed)) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const storagePath = trimmed.replace(/^\/+/, '');
  const { data } = supabase.storage.from(EVENT_IMAGES_BUCKET).getPublicUrl(storagePath);

  return data.publicUrl || null;
}

export function getCategoryEventImagePlaceholder(): string {
  return EVENT_IMAGE_PLACEHOLDER;
}

export function formatAdminEventDate(value?: string | null): string {
  const date = parseEventDate(value);

  if (!date) {
    return 'N/A';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatAdminPrice(price?: number | null): string {
  if (price == null || price === 0) {
    return 'Free';
  }

  return `$${price.toLocaleString('en-US')}`;
}

function normalizeTags(tags?: string[] | null): string[] {
  if (!tags?.length) {
    return [];
  }

  return tags.filter((tag) => Boolean(tag?.trim()));
}

export function mapApiEventToAdminEvent(api: ApiEventRow): AdminEvent {
  const startDate = api.start_date ?? '';
  const endDate = api.end_date ?? '';
  const venue = api.venue?.trim() ?? '';
  const address = api.address?.trim() ?? '';
  const category = api.categories?.name ?? 'General';
  const rawImageUrl = getRawImageUrl(api);
  const imageUrl = resolveStoredEventImageUrl(rawImageUrl);
  const organizerName = api.organizers?.name?.trim() || 'Independent Organizer';
  const organizerAvatarUrl = api.organizers?.avatar_url?.trim() || null;

  return {
    id: api.id,
    title: api.title,
    description: api.description?.trim() ?? '',
    date: formatAdminEventDate(api.start_date),
    startDate,
    endDate,
    endDateDisplay: formatAdminEventDate(api.end_date),
    category,
    venue,
    address,
    location: [venue, address].filter(Boolean).join(', ') || 'Armenia',
    organizerName,
    organizerAvatarUrl,
    views: api.views ?? 0,
    maxViews: 1000,
    status: api.status || 'published',
    imageUrl,
    storedImageUrl: rawImageUrl,
    source: api.source?.trim() ?? '',
    sourceUrl: api.source_url?.trim() ?? '',
    externalId: api.external_id?.trim() ?? '',
    ticketUrl: isValidAdminTicketUrl(api.ticket_url) ? api.ticket_url!.trim() : '',
    storedTicketUrl: api.ticket_url?.trim() ?? '',
    price: formatAdminPrice(api.price),
    priceValue: api.price ?? null,
    language: api.language?.trim() || 'English',
    ageRange: api.age_range?.trim() || 'All ages',
    tags: normalizeTags(api.tags),
    eventType: api.event_type?.trim() ?? '',
  };
}

/** Maps shared-service `EventItem` data using the same admin rules. */
export function mapEventItemToAdminEvent(event: EventItem): AdminEvent {
  return mapApiEventToAdminEvent({
    id: event.id,
    title: event.title,
    start_date: event.startDate ?? event.date,
    end_date: null,
    image_url: event.imageUrl,
    address: event.location,
    venue: null,
    status: event.status ?? 'published',
    views: event.views ?? 0,
    price: event.isFree ? 0 : Number.parseFloat(event.price.replace(/[^\d.]/g, '')) || null,
    categories: event.category ? { name: event.category } : null,
    organizers: null,
  });
}

export function getAdminEventImageSrc(imageUrl: string | null | undefined): string {
  return resolveStoredEventImageUrl(imageUrl);
}

const LINK_BUTTON_BLOCKLIST = ['google.com', 'example.com'];

export function isAdminLinkButtonVisible(url?: string | null): boolean {
  const value = url?.trim();

  if (!value || !isValidAdminExternalUrl(value)) {
    return false;
  }

  const lower = value.toLowerCase();
  return !LINK_BUTTON_BLOCKLIST.some((blocked) => lower.includes(blocked));
}

export function isGoogleSearchFallbackUrl(url?: string | null): boolean {
  const value = url?.trim().toLowerCase() ?? '';
  return value.includes('google.com/search?');
}

export function buildAdminGoogleSearchUrl(title: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`${title.trim()} Armenia`)}`;
}

export function handleAdminEventImageError(event: SyntheticEvent<HTMLImageElement>): void {
  const img = event.currentTarget;

  if (img.getAttribute(IMAGE_FALLBACK_APPLIED_ATTR) === 'true') {
    return;
  }

  img.setAttribute(IMAGE_FALLBACK_APPLIED_ATTR, 'true');
  img.src = EVENT_IMAGE_PLACEHOLDER;
}

export function isBlockedAdminExternalUrl(url?: string | null): boolean {
  const value = url?.trim();

  if (!value) {
    return true;
  }

  const lower = value.toLowerCase();

  return ADMIN_LINK_BLOCKLIST.some((blocked) => lower.includes(blocked));
}

export function isValidAdminSourceUrl(sourceUrl?: string | null): boolean {
  return isValidAdminExternalUrl(sourceUrl);
}

export function isValidAdminTicketUrl(ticketUrl?: string | null): boolean {
  return isValidAdminExternalUrl(ticketUrl);
}

export function isValidAdminExternalUrl(url?: string | null): boolean {
  const value = url?.trim();

  if (!value || !value.startsWith('http')) {
    return false;
  }

  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
  } catch {
    return false;
  }

  return !isBlockedAdminExternalUrl(value);
}
