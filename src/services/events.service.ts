import axios from 'axios';
import {
  BENEFITS,
  FOOTER_QUICK_LINKS,
  LOCATIONS,
  POPULAR_TAGS,
} from '../components/home/mockData';
import type { EventItem } from '../components/home/types';
import {
  PRICE_MARKS,
  RADIUS_MARKS,
} from '../components/events/mockData';
import {
  EVENT_TABS,
  INTERESTED_AVATARS,
} from '../components/event-details/mockData';
import type { EventDetails } from '../components/event-details/types';
import {
  formatEventTime,
  formatWeekday,
  parseEventDate,
} from '../components/events/eventDateUtils';
import { supabase } from '../lib/supabase';

const DEFAULT_EVENT_IMAGE =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200';
const DEFAULT_ORGANIZER_AVATAR =
  'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=200&q=80';

type EventListRow = {
  id: string;
  title: string;
  image_url?: string | null;
  address?: string | null;
  venue?: string | null;
  start_date?: string | null;
  event_type?: string | null;
  language?: string | null;
  price?: number | null;
  categories: { name: string } | null;
  organizers: { name: string } | null;
  views?: number | null;
  status?: 'published' | 'draft' | 'archived' | null;
};

type EventDetailRow = {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  category_id?: string | null;
  organizer_id?: string | null;
  venue?: string | null;
  address?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  ticket_url?: string | null;
  event_type?: string | null;
  language?: string | null;
  price?: number | null;
  categories: { name: string } | null;
  organizers: {
    name: string;
    avatar_url?: string | null;
    description?: string | null;
  } | null;
  views?: number | null;
  status?: 'published' | 'draft' | 'archived' | null;
  tags?: string[] | null;
  age_range?: string | null;
};

type EventCrudPayload = {
  title: string;
  description?: string | null;
  image_url?: string | null;
  venue?: string | null;
  address?: string | null;
  start_date: string;
  end_date?: string | null;
  ticket_url?: string | null;
  category_id?: string | null;
  organizer_id?: string | null;
  status?: 'published' | 'draft' | 'archived';
  views?: number;
};

const api = axios.create({ baseURL: '/api' });
const TOKEN_STORAGE_KEY = 'armenia-events-access-token';

function authHeaders() {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function simulateRequest<T>(data: T): Promise<T> {
  await Promise.resolve();
  return data;
}

function formatDuration(startDate?: string | null, endDate?: string | null): string {
  const start = parseEventDate(startDate);
  const end = parseEventDate(endDate);

  if (!start || !end) {
    return '';
  }

  const diffMs = end.getTime() - start.getTime();

  if (diffMs <= 0) {
    return '';
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours >= 24) {
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `${days} Day${days === 1 ? '' : 's'}`;
  }

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${minutes}m`;
}

function formatPriceLabel(price: number | null | undefined): string {
  const value = price ?? 0;
  return value === 0 ? 'Free' : `$${value}`;
}

function mapEventRowToEventItem(event: EventListRow): EventItem {
  const priceValue = event.price ?? 0;

  return {
    id: event.id,
    title: event.title,
    category: event.categories?.name ?? 'Uncategorized',
    location: event.address ?? event.venue ?? 'Yerevan',
    date: event.start_date ?? '',
    time: formatEventTime(event.start_date),
    imageUrl: event.image_url ?? DEFAULT_EVENT_IMAGE,
    price: formatPriceLabel(priceValue),
    isFree: priceValue === 0,
    eventType: event.event_type ?? 'Offline',
    language: event.language ?? 'English',
    organizer: event.organizers?.name ?? 'Armenia Events',
  } as EventItem;
}

const EVENT_LIST_SELECT = `
  *,
  categories ( name ),
  organizers ( name )
`;

const UPCOMING_EVENTS_LIMIT = 6;
const TOP_PICKS_LIMIT = 6;

type FetchEventListOptions = {
  upcomingOnly?: boolean;
  latestFirst?: boolean;
  limit?: number;
};

async function fetchEventListRows(
  options: FetchEventListOptions = {}
): Promise<EventListRow[]> {
  let query = supabase.from('events').select(EVENT_LIST_SELECT);

  if (options.upcomingOnly) {
    query = query
      .not('start_date', 'is', null)
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true });
  } else if (options.latestFirst) {
    query = query.order('created_at', { ascending: false, nullsFirst: false });
  }

  if (options.limit != null) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as EventListRow[];
}

function mapEventListRowsToEventItems(rows: EventListRow[]): EventItem[] {
  return rows.map((event) => mapEventRowToEventItem(event));
}

export function mapEventRowToEventDetails(row: EventDetailRow): EventDetails {
  const location = row.address ?? row.venue ?? 'Yerevan, Armenia';
  const imageUrl = row.image_url ?? DEFAULT_EVENT_IMAGE;
  const organizerName = row.organizers?.name ?? 'Armenia Events';
  const priceValue = row.price ?? 0;

  return {
    id: row.id,
    title: row.title,
    category: row.categories?.name ?? 'Uncategorized',
    location,
    date: row.start_date ?? '',
    time: formatEventTime(row.start_date),
    price: formatPriceLabel(priceValue),
    isFree: priceValue === 0,
    imageUrl,
    weekday: formatWeekday(row.start_date),
    ticketUrl: row.ticket_url ?? null,
    interestedCount: 0,
    goingCount: 0,
    description: row.description ? [row.description] : [],
    tags: row.tags ?? [],
    duration: formatDuration(row.start_date, row.end_date),
    eventType: row.event_type ?? 'Offline',
    languages: row.language ?? 'English',
    ageRange: row.age_range ?? 'All ages',
    venue: {
      name: row.venue ?? 'Event Venue',
      address: location,
      imageUrl,
      website: '',
      phone: '',
      email: '',
    },
    schedule: [],
    scheduleDays: [],
    tickets: [],
    organizer: {
      name: organizerName,
      role: 'Event Organizer',
      avatarUrl: row.organizers?.avatar_url ?? DEFAULT_ORGANIZER_AVATAR,
      description: row.organizers?.description ?? '',
    },
  };
}

export type EventFiltersData = {
  filterCategories: { name: string; count: number }[];
  eventTypes: { label: string; count: number }[];
  languages: { label: string; count: number }[];
  organizers: { label: string; value: string }[];
  priceMarks: typeof PRICE_MARKS;
  radiusMarks: typeof RADIUS_MARKS;
};

function buildFilterCategoriesFromEvents(events: EventListRow[]): { name: string; count: number }[] {
  const categoryCounts = new Map<string, number>();

  for (const event of events) {
    const name = event.categories?.name ?? 'Uncategorized';
    categoryCounts.set(name, (categoryCounts.get(name) ?? 0) + 1);
  }

  return Array.from(categoryCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function buildFilterEventTypesFromEvents(events: EventListRow[]): { label: string; count: number }[] {
  const eventTypeCounts = new Map<string, number>();

  for (const event of events) {
    const label = event.event_type ?? 'Offline';
    eventTypeCounts.set(label, (eventTypeCounts.get(label) ?? 0) + 1);
  }

  return Array.from(eventTypeCounts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

function buildFilterOrganizersFromEvents(events: EventListRow[]): { label: string; value: string }[] {
  const organizerNames = new Set<string>();

  for (const event of events) {
    const name = event.organizers?.name ?? 'Armenia Events';
    organizerNames.add(name);
  }

  return Array.from(organizerNames)
    .sort((left, right) => left.localeCompare(right))
    .map((name) => ({ label: name, value: name }));
}

type EventsListParams = {
  page?: number;
  pageSize?: number;
  q?: string;
};

type EventsApiResponse = {
  data: EventListRow[];
  total: number;
  page: number;
  pageSize: number;
};

export type EventsPaginatedResult = {
  events: EventItem[];
  total: number;
  page: number;
  pageSize: number;
};

function buildFilterLanguagesFromEvents(events: EventListRow[]): { label: string; count: number }[] {
  const languageCounts = new Map<string, number>();

  for (const event of events) {
    const label = event.language ?? 'English';
    languageCounts.set(label, (languageCounts.get(label) ?? 0) + 1);
  }

  return Array.from(languageCounts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

export const eventsService = {
  async getEvents(params: EventsListParams = {}): Promise<EventsPaginatedResult> {
    try {
      const { data } = await api.get<EventsApiResponse>('/events', {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          q: params.q,
        },
      });

      return {
        events: data.data.map((event) => mapEventRowToEventItem(event)),
        total: data.total,
        page: data.page,
        pageSize: data.pageSize,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = (error.response?.data as { message?: string } | undefined)?.message;
        if (message) {
          throw new Error(message);
        }
      }
      throw error;
    }
  },

  async getEventById(id: string | undefined): Promise<EventDetails> {
    if (!id) {
      throw new Error('Event id is required');
    }

    try {
      const { data } = await api.get<EventDetailRow>(`/events/${id}`);
      return mapEventRowToEventDetails(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = (error.response?.data as { message?: string } | undefined)?.message;
        if (message) {
          throw new Error(message);
        }
      }
      throw error;
    }
  },

  async getUpcomingEvents(): Promise<EventItem[]> {
    const rows = await fetchEventListRows({
      upcomingOnly: true,
      limit: UPCOMING_EVENTS_LIMIT,
    });
    return mapEventListRowsToEventItems(rows);
  },

  async getTopPicks(): Promise<EventItem[]> {
    const rows = await fetchEventListRows({
      latestFirst: true,
      limit: TOP_PICKS_LIMIT,
    });
    return mapEventListRowsToEventItems(rows);
  },

  pickRelatedEvents(
    events: EventItem[],
    currentEventId: string,
    category: string,
    limit = 3,
  ): EventItem[] {
    const others = events.filter((event) => event.id !== currentEventId);
    const sameCategory = others.filter((event) => event.category === category);
    const pool = sameCategory.length > 0 ? sameCategory : others;

    return pool.slice(0, limit);
  },

  async getRelatedEvents(currentEventId: string, category: string): Promise<EventItem[]> {
    const { events } = await this.getEvents();
    return this.pickRelatedEvents(events, currentEventId, category, 3);
  },

  async getTotalEventsCount(): Promise<number> {
    const { total } = await this.getEvents();
    return total;
  },

  async createEvent(payload: EventCrudPayload): Promise<EventDetailRow> {
    const { data } = await api.post<EventDetailRow>('/events', payload, {
      headers: authHeaders(),
    });
    return data;
  },

  async updateEvent(id: string, payload: Partial<EventCrudPayload>): Promise<EventDetailRow> {
    const { data } = await api.patch<EventDetailRow>(`/events/${id}`, payload, {
      headers: authHeaders(),
    });
    return data;
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/events/${id}`, {
      headers: authHeaders(),
    });
  },

  async getEventFilters(): Promise<EventFiltersData> {
    const { data } = await api.get<EventsApiResponse>('/events', {
      params: { page: 1, pageSize: 1000 },
    });

    return {
      filterCategories: buildFilterCategoriesFromEvents(data.data),
      eventTypes: buildFilterEventTypesFromEvents(data.data),
      languages: buildFilterLanguagesFromEvents(data.data),
      organizers: buildFilterOrganizersFromEvents(data.data),
      priceMarks: PRICE_MARKS,
      radiusMarks: RADIUS_MARKS,
    };
  },

  getPopularTags(): Promise<readonly string[]> {
    return simulateRequest(POPULAR_TAGS);
  },

  getBenefits(): Promise<typeof BENEFITS> {
    return simulateRequest([...BENEFITS]);
  },

  getFooterQuickLinks(): Promise<typeof FOOTER_QUICK_LINKS> {
    return simulateRequest([...FOOTER_QUICK_LINKS]);
  },

  getLocations(): Promise<typeof LOCATIONS> {
    return simulateRequest([...LOCATIONS]);
  },

  getInterestedAvatars(): Promise<string[]> {
    return simulateRequest([...INTERESTED_AVATARS]);
  },

  getEventTabs(): Promise<readonly string[]> {
    return simulateRequest(EVENT_TABS);
  },
};
