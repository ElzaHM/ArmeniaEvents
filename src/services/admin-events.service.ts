import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import {
  mapApiEventToAdminEvent,
  type ApiEventRow,
} from '../components/admin/mapApiEventToAdminEvent';
import type { AdminEvent } from '../components/admin/types';
import { supabase } from '../lib/supabase';
import { eventsService } from './events.service';

const EVENT_IMAGES_BUCKET =
  import.meta.env.VITE_SUPABASE_EVENT_IMAGES_BUCKET ?? 'EVENT_IMAGES_BUCKET';

export type AdminCreateEventFormValues = {
  title: string;
  description: string;
  category: string;
  eventType: string;
  venue: string;
  address: string;
  organizer: string;
  ticket_url?: string;
  startDate: Dayjs;
  startTime: Dayjs;
  endDate?: Dayjs;
  endTime?: Dayjs;
};

export const ADMIN_EVENT_SELECT =
  '*, categories(name), organizers(name, avatar_url)';

export async function fetchAdminEvents(searchQuery?: string): Promise<AdminEvent[]> {
  let query = supabase
    .from('events')
    .select(ADMIN_EVENT_SELECT)
    .order('start_date', { ascending: false, nullsFirst: false });

  if (searchQuery?.trim()) {
    const needle = searchQuery.trim();
    query = query.or(
      `title.ilike.%${needle}%,venue.ilike.%${needle}%,address.ilike.%${needle}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ApiEventRow[]).map(mapApiEventToAdminEvent);
}

export async function fetchUpcomingAdminEvents(limit = 6): Promise<AdminEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select(ADMIN_EVENT_SELECT)
    .not('start_date', 'is', null)
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ApiEventRow[]).map(mapApiEventToAdminEvent);
}

async function blobUrlToFile(blobUrl: string, fileName: string): Promise<File> {
  const response = await fetch(blobUrl);

  if (!response.ok) {
    throw new Error('Failed to read uploaded image.');
  }

  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type || 'image/jpeg' });
}

export async function uploadEventImage(file: File): Promise<string> {
  const extension = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
  const objectPath = `events/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(EVENT_IMAGES_BUCKET)
    .upload(objectPath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'image/jpeg',
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(EVENT_IMAGES_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}

function combineDateAndTime(date: Dayjs, time: Dayjs): string {
  return date.hour(time.hour()).minute(time.minute()).second(0).millisecond(0).toISOString();
}

async function resolveCategoryId(categoryName: string): Promise<string | null> {
  const normalized = categoryName.trim();

  if (!normalized) {
    return null;
  }

  const { data: exactMatch } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', normalized)
    .limit(1)
    .maybeSingle();

  if (exactMatch) {
    return exactMatch.id;
  }

  const { data: partialMatch } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', `%${normalized}%`)
    .limit(1)
    .maybeSingle();

  return partialMatch?.id ?? null;
}

async function resolveOrganizerId(organizerName: string): Promise<string | null> {
  const normalized = organizerName.trim();

  if (!normalized) {
    return null;
  }

  const { data: existing } = await supabase
    .from('organizers')
    .select('id')
    .ilike('name', normalized)
    .limit(1)
    .maybeSingle();

  if (existing) {
    return existing.id;
  }

  const { data: created, error } = await supabase
    .from('organizers')
    .insert({ name: normalized })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return created.id;
}

export type AdminEventEditFormValues = {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  source: string;
  status: AdminEvent['status'];
  venue: string;
  address: string;
  startDate: Dayjs;
  price: number | null;
  language: string;
  ageRange: string;
  ticketUrl: string;
  views: number;
  externalId: string;
};

export function adminEventToEditFormValues(event: AdminEvent): AdminEventEditFormValues {
  return {
    title: event.title,
    description: event.description,
    imageUrl: event.storedImageUrl || '',
    category: event.category,
    source: event.source,
    status: event.status,
    venue: event.venue,
    address: event.address,
    startDate: event.startDate ? dayjs(event.startDate) : dayjs(),
    price: event.priceValue,
    language: event.language,
    ageRange: event.ageRange,
    ticketUrl: event.storedTicketUrl || event.ticketUrl,
    views: event.views,
    externalId: event.externalId,
  };
}

export async function fetchAdminCategoryNames(): Promise<string[]> {
  const { data, error } = await supabase.from('categories').select('name').order('name');

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => row.name).filter(Boolean);
}

export async function updateAdminEvent(
  id: string,
  values: AdminEventEditFormValues,
  pendingImage?: { url: string; name: string } | null,
): Promise<string> {
  const categoryId = await resolveCategoryId(values.category);

  let imageUrl = values.imageUrl.trim();

  if (pendingImage) {
    const imageFile = await blobUrlToFile(pendingImage.url, pendingImage.name);
    imageUrl = await uploadEventImage(imageFile);
  }

  const { error } = await supabase
    .from('events')
    .update({
      title: values.title.trim(),
      description: values.description.trim(),
      image_url: imageUrl || null,
      venue: values.venue.trim() || null,
      address: values.address.trim() || null,
      start_date: values.startDate.toISOString(),
      status: values.status,
      views: values.views,
      source: values.source.trim() || null,
      ticket_url: values.ticketUrl.trim() || null,
      price: values.price ?? 0,
      language: values.language.trim() || null,
      age_range: values.ageRange.trim() || null,
      category_id: categoryId,
    })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return imageUrl;
}

export async function createAdminEvent(
  values: AdminCreateEventFormValues,
  image: { url: string; name: string },
): Promise<void> {
  const imageFile = await blobUrlToFile(image.url, image.name);
  const imageUrl = await uploadEventImage(imageFile);

  const [categoryId, organizerId] = await Promise.all([
    resolveCategoryId(values.category),
    resolveOrganizerId(values.organizer),
  ]);

  const startDate = combineDateAndTime(values.startDate, values.startTime);
  const endDate =
    values.endDate && values.endTime
      ? combineDateAndTime(values.endDate, values.endTime)
      : values.endDate
        ? combineDateAndTime(values.endDate, values.startTime)
        : null;

  await eventsService.createEvent({
    title: values.title.trim(),
    description: values.description.trim(),
    image_url: imageUrl,
    venue: values.venue.trim(),
    address: values.address.trim(),
    start_date: startDate,
    end_date: endDate,
    ticket_url: values.ticket_url?.trim() || null,
    category_id: categoryId,
    organizer_id: organizerId,
    status: 'published',
    views: 0,
  });
}
