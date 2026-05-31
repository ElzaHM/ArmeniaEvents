import type {
  ActivityItem,
  AdminCategory,
  AdminEvent,
  AdminSettings,
  AdminUser,
  AnalyticsDataPoint,
  AnalyticsSummary,
  CategoryDistribution,
  DashboardData,
  QuickAction,
  StatMetric,
} from './types';

export const ADMIN_PROFILE = {
  name: 'Admin',
  role: 'Super Administrator',
  avatarUrl:
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=D48806',
};

export const DASHBOARD_STATS: StatMetric[] = [
  {
    id: 'total-events',
    label: 'Total Events',
    value: 128,
    changePercent: 12.5,
    icon: 'calendar',
  },
  {
    id: 'active-users',
    label: 'Active Users',
    value: 2543,
    changePercent: 18.7,
    icon: 'users',
  },
  {
    id: 'categories',
    label: 'Categories',
    value: 24,
    changePercent: 8.2,
    icon: 'folder',
  },
  {
    id: 'page-views',
    label: 'Page Views',
    value: 45280,
    changePercent: 22.1,
    icon: 'eye',
  },
];

export const UPCOMING_ADMIN_EVENTS: AdminEvent[] = [
  {
    id: '1',
    title: 'Yerevan Wine Days 2024',
    date: '2024-05-24',
    category: 'Festival',
    location: 'Yerevan, Armenia',
    views: 842,
    maxViews: 1000,
    status: 'published',
    imageUrl:
      'https://images.unsplash.com/photo-1510812431400-5745154a390a?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: '2',
    title: 'React Armenia Conference',
    date: '2024-06-15',
    category: 'Technology',
    location: 'Yerevan, Armenia',
    views: 620,
    maxViews: 800,
    status: 'published',
    imageUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: '3',
    title: 'Jazz Night at Cascade',
    date: '2024-05-30',
    category: 'Music',
    location: 'Yerevan, Armenia',
    views: 310,
    maxViews: 500,
    status: 'draft',
    imageUrl:
      'https://images.unsplash.com/photo-1415201364774-f6f0ff35a028?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: '4',
    title: 'Armenian Startup Summit',
    date: '2024-07-08',
    category: 'Business',
    location: 'Gyumri, Armenia',
    views: 480,
    maxViews: 600,
    status: 'published',
    imageUrl:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: '5',
    title: 'Modern Art Exhibition',
    date: '2024-06-10',
    category: 'Culture',
    location: 'Yerevan, Armenia',
    views: 195,
    maxViews: 400,
    status: 'draft',
    imageUrl:
      'https://images.unsplash.com/photo-1531243269054-5ebf6f34067e?auto=format&fit=crop&w=120&q=80',
  },
];

export const ANALYTICS_CHART_DATA: AnalyticsDataPoint[] = [
  { date: 'May 1', views: 420, registrations: 32 },
  { date: 'May 5', views: 580, registrations: 45 },
  { date: 'May 10', views: 710, registrations: 58 },
  { date: 'May 15', views: 890, registrations: 72 },
  { date: 'May 20', views: 1050, registrations: 84 },
  { date: 'May 25', views: 980, registrations: 76 },
  { date: 'May 30', views: 1240, registrations: 96 },
];

export const ANALYTICS_SUMMARY: AnalyticsSummary = {
  views: {
    id: 'views',
    label: 'Views',
    value: 1240,
    changePercent: 15.3,
    icon: 'eye',
  },
  registrations: {
    id: 'registrations',
    label: 'Registrations',
    value: 96,
    changePercent: 12.8,
    icon: 'users',
  },
  engagementRate: {
    id: 'engagement',
    label: 'Engagement',
    value: 7.7,
    changePercent: 4.2,
    icon: 'calendar',
  },
};

export const CATEGORY_DISTRIBUTION: CategoryDistribution[] = [
  { id: '1', name: 'Music', count: 32, percentage: 28, color: '#D48806' },
  { id: '2', name: 'Conference', count: 24, percentage: 21, color: '#E8B84A' },
  { id: '3', name: 'Technology', count: 22, percentage: 19, color: '#B8730A' },
  { id: '4', name: 'Culture', count: 18, percentage: 16, color: '#F0C674' },
  { id: '5', name: 'Other', count: 18, percentage: 16, color: '#8C6A2F' },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    type: 'event_created',
    message: 'New event created:',
    highlight: 'React Armenia Conference',
    timestamp: '2024-05-30T10:30:00Z',
  },
  {
    id: '2',
    type: 'user_registered',
    message: 'New user registered:',
    highlight: 'Anna Petrosyan',
    timestamp: '2024-05-30T08:15:00Z',
  },
  {
    id: '3',
    type: 'category_added',
    message: 'Category added:',
    highlight: 'Technology',
    timestamp: '2024-05-29T16:45:00Z',
  },
  {
    id: '4',
    type: 'event_updated',
    message: 'Event updated:',
    highlight: 'Jazz Night at Cascade',
    timestamp: '2024-05-29T14:20:00Z',
  },
  {
    id: '5',
    type: 'settings_updated',
    message: 'Settings updated by',
    highlight: 'Admin',
    timestamp: '2024-05-28T11:00:00Z',
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: '1',
    title: 'Add New Event',
    description: 'Create and publish a new event.',
    icon: 'plus',
    path: '/admin/events',
  },
  {
    id: '2',
    title: 'Add New Category',
    description: 'Organize events with categories.',
    icon: 'folder-add',
    path: '/admin/categories',
  },
  {
    id: '3',
    title: 'Send Notification',
    description: 'Notify users about events.',
    icon: 'notification',
    path: '/admin/settings',
  },
  {
    id: '4',
    title: 'Export Reports',
    description: 'Download analytics reports.',
    icon: 'export',
    path: '/admin/analytics',
  },
];

export const ADMIN_CATEGORIES: AdminCategory[] = [
  {
    id: '1',
    name: 'Music',
    slug: 'music',
    eventCount: 32,
    description: 'Concerts, festivals, and live performances',
    isActive: true,
  },
  {
    id: '2',
    name: 'Technology',
    slug: 'technology',
    eventCount: 22,
    description: 'Tech talks, hackathons, and workshops',
    isActive: true,
  },
  {
    id: '3',
    name: 'Business',
    slug: 'business',
    eventCount: 18,
    description: 'Conferences, networking, and summits',
    isActive: true,
  },
  {
    id: '4',
    name: 'Culture',
    slug: 'culture',
    eventCount: 15,
    description: 'Art exhibitions, theater, and heritage events',
    isActive: true,
  },
  {
    id: '5',
    name: 'Festival',
    slug: 'festival',
    eventCount: 12,
    description: 'Seasonal and community festivals',
    isActive: false,
  },
];

export const ADMIN_USERS: AdminUser[] = [
  {
    id: '1',
    name: 'Anna Petrosyan',
    email: 'anna.petrosyan@example.com',
    role: 'admin',
    status: 'active',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    joinedAt: '2024-01-15',
    eventsCreated: 12,
  },
  {
    id: '2',
    name: 'David Hakobyan',
    email: 'david.h@example.com',
    role: 'moderator',
    status: 'active',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    joinedAt: '2024-02-20',
    eventsCreated: 8,
  },
  {
    id: '3',
    name: 'Lusine Avetisyan',
    email: 'lusine.a@example.com',
    role: 'user',
    status: 'active',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lusine',
    joinedAt: '2024-03-10',
    eventsCreated: 3,
  },
  {
    id: '4',
    name: 'Armen Sargsyan',
    email: 'armen.s@example.com',
    role: 'user',
    status: 'pending',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Armen',
    joinedAt: '2024-05-28',
    eventsCreated: 0,
  },
  {
    id: '5',
    name: 'Narine Grigoryan',
    email: 'narine.g@example.com',
    role: 'admin',
    status: 'inactive',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Narine',
    joinedAt: '2023-11-05',
    eventsCreated: 24,
  },
];

export const ADMIN_SETTINGS: AdminSettings = {
  siteName: 'Armenia Events',
  supportEmail: 'support@armeniaevents.am',
  defaultLanguage: 'en',
  timezone: 'Asia/Yerevan',
  enableNotifications: true,
  enablePublicRegistration: true,
  maintenanceMode: false,
};

export function getDashboardData(): DashboardData {
  return {
    stats: DASHBOARD_STATS,
    upcomingEvents: UPCOMING_ADMIN_EVENTS,
    analyticsChart: ANALYTICS_CHART_DATA,
    analyticsSummary: ANALYTICS_SUMMARY,
    categoryDistribution: CATEGORY_DISTRIBUTION,
    recentActivity: RECENT_ACTIVITY,
    quickActions: QUICK_ACTIONS,
  };
}

export function getAdminEvents(): AdminEvent[] {
  return [...UPCOMING_ADMIN_EVENTS];
}

export function getAdminCategories(): AdminCategory[] {
  return [...ADMIN_CATEGORIES];
}

export function getAdminUsers(): AdminUser[] {
  return [...ADMIN_USERS];
}

export function getAdminSettings(): AdminSettings {
  return { ...ADMIN_SETTINGS };
}
