import type { EventItem } from '../home/types';

export interface ScheduleItem {
  time: string;
  title: string;
}

export interface TicketOption {
  id: string;
  name: string;
  description: string;
  price: string;
  isFree: boolean;
}

export interface VenueInfo {
  name: string;
  address: string;
  imageUrl: string;
  website: string;
  phone: string;
  email: string;
}

export interface OrganizerInfo {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface EventDetails extends EventItem {
  weekday: string;
  interestedCount: number;
  goingCount: number;
  description: string[];
  tags: string[];
  duration: string;
  eventType: string;
  languages: string;
  ageRange: string;
  venue: VenueInfo;
  schedule: ScheduleItem[];
  scheduleDays: { date: string; label: string; weekday: string }[];
  tickets: TicketOption[];
  organizer: OrganizerInfo;
}
