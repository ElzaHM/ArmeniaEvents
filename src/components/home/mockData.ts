import type { Category, EventItem } from './types';

export const POPULAR_TAGS = [
  'Programming',
  'Business',
  'Music',
  'Design',
  'Art',
  'Startup',
  'AI & Tech',
] as const;

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Programming', icon: 'code', eventCount: 124 },
  { id: '2', name: 'Business', icon: 'briefcase', eventCount: 98 },
  { id: '3', name: 'Startup', icon: 'rocket', eventCount: 76 },
  { id: '4', name: 'Music', icon: 'music', eventCount: 112 },
  { id: '5', name: 'Design', icon: 'palette', eventCount: 64 },
  { id: '6', name: 'Art', icon: 'camera', eventCount: 89 },
  { id: '7', name: 'AI & Tech', icon: 'bulb', eventCount: 53 },
];

export const UPCOMING_EVENTS: EventItem[] = [
  {
    id: '1',
    title: 'Yerevan Wine Days 2024',
    category: 'Festival',
    location: 'Yerevan, Armenia',
    date: '2024-05-24',
    time: '12:00',
    price: 'Free',
    isFree: true,
    imageUrl:
      'https://images.unsplash.com/photo-1510812431400-5745154a390a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'React Armenia Conference',
    category: 'Technology',
    location: 'Yerevan, Armenia',
    date: '2024-06-15',
    time: '10:00',
    price: '$25',
    isFree: false,
    imageUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Jazz Night at Cascade',
    category: 'Music',
    location: 'Yerevan, Armenia',
    date: '2024-05-30',
    time: '19:00',
    price: '$15',
    isFree: false,
    imageUrl:
      'https://images.unsplash.com/photo-1415201364774-f6f0ff35a028?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    title: 'Armenian Startup Summit',
    category: 'Business',
    location: 'Gyumri, Armenia',
    date: '2024-07-08',
    time: '09:30',
    price: 'Free',
    isFree: true,
    imageUrl:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80',
  },
];

export const TOP_PICKS: EventItem[] = [
  {
    id: '5',
    title: 'Python Community Meetup',
    category: 'Programming',
    location: 'Yerevan, Armenia',
    date: '2024-06-02',
    time: '18:00',
    price: 'Free',
    isFree: true,
    imageUrl:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    title: 'Modern Art Exhibition',
    category: 'Art',
    location: 'Yerevan, Armenia',
    date: '2024-06-10',
    time: '11:00',
    price: '$10',
    isFree: false,
    imageUrl:
      'https://images.unsplash.com/photo-1531243269054-5ebf6f34067e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '7',
    title: 'UI/UX Design Workshop',
    category: 'Design',
    location: 'Yerevan, Armenia',
    date: '2024-06-18',
    time: '14:00',
    price: '$20',
    isFree: false,
    imageUrl:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '8',
    title: 'AI & Machine Learning Talk',
    category: 'AI & Tech',
    location: 'Yerevan, Armenia',
    date: '2024-06-22',
    time: '17:30',
    price: 'Free',
    isFree: true,
    imageUrl:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
  },
];

export const BENEFITS = [
  {
    id: '1',
    title: 'Local Events',
    description: 'Find events happening near you across Armenia',
    icon: 'environment' as const,
  },
  {
    id: '2',
    title: 'Save Favorites',
    description: 'Save events you love and never miss them',
    icon: 'heart' as const,
  },
  {
    id: '3',
    title: 'Smart Notifications',
    description: 'Get notified about events you care about',
    icon: 'bell' as const,
  },
  {
    id: '4',
    title: 'Share Easily',
    description: 'Share events with your friends and community',
    icon: 'share' as const,
  },
];

export const FOOTER_QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'Categories', href: '/events' },
  { label: 'Favorites', href: '/events' },
  { label: 'About', href: '/events' },
];

export const FOOTER_CATEGORIES = [
  'Programming',
  'Business',
  'Music',
  'Design',
  'Art',
  'Startup',
];

export const LOCATIONS = [
  { value: 'yerevan', label: 'Yerevan, Armenia' },
  { value: 'gyumri', label: 'Gyumri, Armenia' },
  { value: 'vanadzor', label: 'Vanadzor, Armenia' },
  { value: 'dilijan', label: 'Dilijan, Armenia' },
];
