import axios from 'axios';
import {
  BENEFITS,
  FOOTER_QUICK_LINKS,
  LOCATIONS,
  POPULAR_TAGS,
  TOP_PICKS,
  UPCOMING_EVENTS,
} from '../components/home/mockData';
import type { EventItem } from '../components/home/types';
import {
  EVENT_TYPES,
  FILTER_CATEGORIES,
  LANGUAGES,
  ORGANIZERS,
  PRICE_MARKS,
  RADIUS_MARKS,
  SORT_OPTIONS,
} from '../components/events/mockData';
import {
  EVENT_TABS,
  INTERESTED_AVATARS,
  RELATED_EVENTS,
} from '../components/event-details/mockData';
import type { EventDetails } from '../components/event-details/types';

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
  start_date: string;
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
  start_date: string;
  end_date?: string | null;
  ticket_url?: string | null;
  categories: { name: string } | null;
  organizers: {
    name: string;
    avatar_url?: string | null;
    description?: string | null;
  } | null;
  views?: number | null;
  status?: 'published' | 'draft' | 'archived' | null;
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

function formatEventTime(startDate: string): string {
  return new Date(startDate).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatWeekday(startDate: string): string {
  return new Date(startDate)
    .toLocaleDateString('en-US', { weekday: 'short' })
    .toUpperCase();
}

function formatDuration(startDate: string, endDate?: string | null): string {
  if (!startDate || !endDate) {
    return '';
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
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

function mapEventRowToEventItem(event: EventListRow): EventItem {
  return {
    id: event.id,
    title: event.title,
    category: event.categories?.name ?? 'Uncategorized',
    location: event.address ?? event.venue ?? 'Yerevan',
    date: event.start_date,
    time: formatEventTime(event.start_date),
    imageUrl: event.image_url ?? DEFAULT_EVENT_IMAGE,
    price: 'Free',
    isFree: true,
  };
}

export function mapEventRowToEventDetails(row: EventDetailRow): EventDetails {
  const location = row.address ?? row.venue ?? 'Yerevan, Armenia';
  const imageUrl = row.image_url ?? DEFAULT_EVENT_IMAGE;
  const organizerName = row.organizers?.name ?? 'Armenia Events';

  return {
    id: row.id,
    title: row.title,
    category: row.categories?.name ?? 'Uncategorized',
    location,
    date: row.start_date,
    time: formatEventTime(row.start_date),
    price: 'Free',
    isFree: true,
    imageUrl,
    weekday: formatWeekday(row.start_date),
    interestedCount: 0,
    goingCount: 0,
    description: row.description ? [row.description] : [],
    tags: [],
    duration: formatDuration(row.start_date, row.end_date),
    eventType: 'Offline',
    languages: 'English',
    ageRange: 'All ages',
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
    },
  };
}

export type SortOption = {
  value: string;
  label: string;
};

export type EventFiltersData = {
  filterCategories: { name: string; count: number }[];
  eventTypes: { label: string; count: number }[];
  languages: { label: string; count: number }[];
  organizers: { name: string; count: number }[];
  priceMarks: typeof PRICE_MARKS;
  radiusMarks: typeof RADIUS_MARKS;
};

export const eventsService = {
  async getEvents(): Promise<EventItem[]> {
    const { data } = await api.get<EventListRow[]>('/events');
    return data.map((event) => mapEventRowToEventItem(event));
  },

  async getEventById(id: string | undefined): Promise<EventDetails> {
    if (!id) {
      throw new Error('Event id is required');
    }

    const { data } = await api.get<EventDetailRow>(`/events/${id}`);
    return mapEventRowToEventDetails(data);
  },

  getUpcomingEvents(): Promise<EventItem[]> {
    return simulateRequest([...UPCOMING_EVENTS]);
  },

  getTopPicks(): Promise<EventItem[]> {
    return simulateRequest([...TOP_PICKS]);
  },

  getRelatedEvents(): Promise<EventItem[]> {
    return simulateRequest([...RELATED_EVENTS]);
  },

  async getTotalEventsCount(): Promise<number> {
    const events = await this.getEvents();
    return events.length;
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

  getSortOptions(): Promise<SortOption[]> {
    return simulateRequest([...SORT_OPTIONS]);
  },

  getEventFilters(): Promise<EventFiltersData> {
    return simulateRequest({
      filterCategories: [...FILTER_CATEGORIES],
      eventTypes: [...EVENT_TYPES],
      languages: [...LANGUAGES],
      organizers: [...ORGANIZERS],
      priceMarks: PRICE_MARKS,
      radiusMarks: RADIUS_MARKS,
    });
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
