import { CATEGORIES, TOP_PICKS, UPCOMING_EVENTS } from '../home/mockData';
import type { EventItem } from '../home/types';

export const ALL_EVENTS: EventItem[] = [...UPCOMING_EVENTS, ...TOP_PICKS];

export const TOTAL_EVENTS = 320;

export const SORT_OPTIONS = [
  { value: 'date-newest', label: 'Date (Newest)' },
  { value: 'date-oldest', label: 'Date (Oldest)' },
];

export const FILTER_CATEGORIES = CATEGORIES.map((category) => ({
  name: category.name,
  count: category.eventCount,
}));

export const EVENT_TYPES = [
  { label: 'Online', count: 86 },
  { label: 'Offline', count: 198 },
  { label: 'Hybrid', count: 36 },
];

export const LANGUAGES = [
  { label: 'Armenian', count: 142 },
  { label: 'English', count: 118 },
  { label: 'Russian', count: 60 },
];

export const ORGANIZERS = [
  { name: 'Impact Hub', count: 32 },
  { name: 'UEICT', count: 28 },
  { name: 'TUMO Center', count: 24 },
  { name: 'Armenian Code Academy', count: 19 },
  { name: 'Creative Armenia', count: 15 },
];

export const PRICE_MARKS = {
  0: 'Free',
  100: '$100+',
};

export const RADIUS_MARKS = {
  5: '5km',
  25: '25km',
  50: '50km',
  100: '100+km',
};
