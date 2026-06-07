/**
 * Event domain model.
 * Unifies EventItem (home/events list), EventDetails (detail page),
 * and AdminEvent (admin panel) into one canonical model family.
 */

/** Formerly `AdminEventStatus` in components/admin/types.ts */
export type EventStatus = 'published' | 'draft' | 'archived';

export type EventFormat = 'online' | 'offline' | 'hybrid';

export interface ScheduleEntry {
  time: string;
  title: string;
}

export interface ScheduleDay {
  date: string;
  label: string;
  weekday: string;
}

export interface Ticket {
  id: string;
  name: string;
  description: string;
  price: string;
  isFree: boolean;
}

export interface Venue {
  name: string;
  address: string;
  imageUrl: string;
  website: string;
  phone: string;
  email: string;
}

export interface Organizer {
  id?: string;
  name: string;
  role: string;
  avatarUrl: string;
}

/**
 * Core fields present on every event representation.
 */
export interface EventCore {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  imageUrl: string;
}

/**
 * Scheduling and pricing fields used on public surfaces.
 */
export interface EventPublicFields {
  time: string;
  price: string;
  isFree: boolean;
}

/**
 * Admin dashboard / management fields.
 */
export interface EventAdminFields {
  views: number;
  maxViews: number;
  status: EventStatus;
}

/**
 * Detail-page-only content and relations.
 */
export interface EventDetailFields {
  weekday: string;
  interestedCount: number;
  description: string[];
  tags: string[];
  duration: string;
  eventType: EventFormat | string;
  languages: string;
  ageRange: string;
  venue: Venue;
  schedule: ScheduleEntry[];
  scheduleDays: ScheduleDay[];
  tickets: Ticket[];
  organizer: Organizer;
}

/**
 * Canonical event entity — superset of all fields used across the app.
 * Optional groups reflect context (list vs detail vs admin).
 */
export interface Event extends EventCore, Partial<EventPublicFields>, Partial<EventAdminFields>, Partial<EventDetailFields> {}

/**
 * List / card view (home carousels, events list, related events).
 * Formerly `EventItem` in components/home/types.ts.
 */
export type EventSummary = EventCore & EventPublicFields;

/**
 * Full event detail page payload.
 * Formerly `EventDetails` in components/event-details/types.ts.
 */
export type EventDetail = EventSummary & EventDetailFields;

/**
 * Admin events table / dashboard row.
 * Formerly `AdminEvent` in components/admin/types.ts.
 */
export type EventAdmin = EventCore & EventAdminFields;

/** Legacy aliases for gradual migration (prefer EventSummary / EventDetail / EventAdmin). */
export type EventItem = EventSummary;
export type EventDetails = EventDetail;
export type AdminEvent = EventAdmin;

/** Legacy names for nested detail types used in components/event-details/types.ts */
export type ScheduleItem = ScheduleEntry;
export type TicketOption = Ticket;
export type VenueInfo = Venue;
export type OrganizerInfo = Organizer;
