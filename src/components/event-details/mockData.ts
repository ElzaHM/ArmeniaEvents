import { ALL_EVENTS } from '../events/mockData';
import { UPCOMING_EVENTS } from '../home/mockData';
import type { EventDetails } from './types';

export const EVENT_DETAILS: Record<string, EventDetails> = {
  '1': {
    id: '1',
    title: 'Yerevan Wine Days 2024',
    category: 'Festival',
    location: 'Yerevan, Armenia',
    date: '2024-05-24',
    time: '12:00',
    weekday: 'FRI',
    price: 'Free',
    isFree: true,
    imageUrl:
      'https://images.unsplash.com/photo-1510812431400-5745154a390a?auto=format&fit=crop&w=1200&q=80',
    interestedCount: 245,
    goingCount: 120,
    description: [
      'Join us for the annual Yerevan Wine Days festival — a celebration of Armenian winemaking heritage, local cuisine, and vibrant culture in the heart of the city.',
      'Explore tastings from dozens of wineries, enjoy live music, artisan food stalls, and workshops led by master vintners. Whether you are a connoisseur or a curious first-timer, there is something for everyone.',
    ],
    tags: ['Wine', 'Tasting', 'Festival', 'Food', 'Culture'],
    duration: '2 Days (May 24 – May 25)',
    eventType: 'Offline',
    languages: 'English, Armenian',
    ageRange: '18+',
    venue: {
      name: 'Cascade Complex',
      address: '10 Tamanyan St, Yerevan 0009, Armenia',
      imageUrl:
        'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
      website: 'cascade.am',
      phone: '+374 11 123456',
      email: 'info@cascade.am',
    },
    scheduleDays: [
      { date: '2024-05-24', label: 'May 24', weekday: 'Fri' },
      { date: '2024-05-25', label: 'May 25', weekday: 'Sat' },
    ],
    schedule: [
      { time: '12:00', title: 'Festival Opening' },
      { time: '13:00', title: 'Wine Tasting Session' },
      { time: '15:00', title: 'Winemaking Workshop' },
      { time: '18:00', title: 'Live Music & DJ Set' },
    ],
    tickets: [
      {
        id: 'general',
        name: 'General Admission',
        description: 'Access to all public areas and tastings',
        price: 'Free',
        isFree: true,
      },
      {
        id: 'tasting',
        name: 'Tasting Pass',
        description: 'Premium wine tastings and masterclass entry',
        price: '$25',
        isFree: false,
      },
      {
        id: 'vip',
        name: 'VIP Pass',
        description: 'Exclusive lounge, reserved seating, and gift bag',
        price: '$50',
        isFree: false,
      },
    ],
    organizer: {
      name: 'Yerevan Wine Events',
      role: 'Event Organizer',
      avatarUrl:
        'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=200&q=80',
    },
  },
};

export function getEventDetails(id: string | undefined): EventDetails {
  if (id && EVENT_DETAILS[id]) {
    return EVENT_DETAILS[id];
  }

  const fallback = UPCOMING_EVENTS[0];
  return {
    ...fallback,
    weekday: 'FRI',
    interestedCount: 128,
    goingCount: 64,
    description: [
      'Discover an unforgettable experience at this featured event in Armenia.',
      'Join fellow attendees for a day filled with activities, networking, and entertainment.',
    ],
    tags: [fallback.category, 'Events', 'Armenia'],
    duration: '1 Day',
    eventType: 'Offline',
    languages: 'English, Armenian',
    ageRange: 'All ages',
    venue: {
      name: 'Event Venue',
      address: fallback.location,
      imageUrl: fallback.imageUrl,
      website: 'armeniaevents.am',
      phone: '+374 10 000000',
      email: 'info@armeniaevents.am',
    },
    scheduleDays: [{ date: fallback.date, label: 'Day 1', weekday: 'Fri' }],
    schedule: [{ time: fallback.time, title: 'Main Event' }],
    tickets: [
      {
        id: 'general',
        name: 'General Admission',
        description: 'Standard event access',
        price: fallback.price,
        isFree: fallback.isFree,
      },
    ],
    organizer: {
      name: 'Armenia Events',
      role: 'Event Organizer',
      avatarUrl:
        'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=200&q=80',
    },
  };
}

export const RELATED_EVENTS = ALL_EVENTS.filter((event) => event.id !== '1').slice(0, 5);

export const INTERESTED_AVATARS = [
  'https://i.pravatar.cc/80?img=1',
  'https://i.pravatar.cc/80?img=2',
  'https://i.pravatar.cc/80?img=3',
  'https://i.pravatar.cc/80?img=4',
];

export const EVENT_TABS = ['Details', 'Schedule', 'Venue', 'Gallery', 'Reviews'] as const;
