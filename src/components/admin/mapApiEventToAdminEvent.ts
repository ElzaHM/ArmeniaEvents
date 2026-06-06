import { parseEventDate } from '../events/eventDateUtils';
import type { EventItem } from '../home/types';
import type { AdminEvent, AdminEventStatus } from './types';

export const EVENT_IMAGE_PLACEHOLDER =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200';

export const ORGANIZER_AVATAR_PLACEHOLDER =
  'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=200&q=80';

/** Raw event shape from Supabase admin queries. */
export type ApiEventRow = {
  id: string;
  title: string;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string | null;
  image_url?: string | null;
  address?: string | null;
  venue?: string | null;
  status?: AdminEventStatus | null;
  views?: number | null;
  categories?: { name: string } | null;
  organizers?: { name: string; avatar_url?: string | null } | null;
};

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

export function mapApiEventToAdminEvent(api: ApiEventRow): AdminEvent {
  const startDate = api.start_date ?? '';
  const endDate = api.end_date ?? '';

  return {
    id: api.id,
    title: api.title,
    date: formatAdminEventDate(api.start_date),
    startDate,
    endDate,
    endDateDisplay: formatAdminEventDate(api.end_date),
    category: api.categories?.name ?? 'General',
    location: api.address || api.venue || 'Armenia',
    organizerName: api.organizers?.name ?? 'N/A',
    organizerAvatarUrl: api.organizers?.avatar_url || ORGANIZER_AVATAR_PLACEHOLDER,
    views: api.views ?? 0,
    maxViews: 1000,
    status: api.status || 'published',
    imageUrl: api.image_url || EVENT_IMAGE_PLACEHOLDER,
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
    categories: event.category ? { name: event.category } : null,
    organizers: null,
  });
}
