export type AdminEventStatus = 'published' | 'draft' | 'archived';

export type AdminUserRole = 'super_admin' | 'admin' | 'moderator' | 'user';

export type AdminUserStatus = 'active' | 'inactive' | 'pending';

export type ActivityType =
  | 'event_created'
  | 'event_updated'
  | 'user_registered'
  | 'category_added'
  | 'settings_updated';

export interface StatMetric {
  id: string;
  label: string;
  value: number;
  changePercent: number;
  icon: 'calendar' | 'users' | 'folder' | 'eye';
}

export interface AdminEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startDate: string;
  endDate: string;
  endDateDisplay: string;
  category: string;
  categoryId: string | null;
  categoryIsActive: boolean | null;
  venue: string;
  address: string;
  location: string;
  organizerName: string;
  organizerAvatarUrl: string | null;
  views: number;
  maxViews: number;
  status: AdminEventStatus;
  imageUrl: string | null;
  storedImageUrl: string;
  source: string;
  sourceUrl: string;
  externalId: string;
  ticketUrl: string;
  storedTicketUrl: string;
  price: string;
  priceValue: number | null;
  language: string;
  ageRange: string;
  tags: string[];
  eventType: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  eventCount: number;
  description: string;
  isActive: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  avatarUrl: string;
  joinedAt: string;
  eventsCreated: number;
}

export interface AnalyticsDataPoint {
  date: string;
  views: number;
  registrations: number;
}

export interface AnalyticsSummary {
  views: StatMetric;
  registrations: StatMetric;
  engagementRate: StatMetric;
}

export interface CategoryDistribution {
  id: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  highlight: string;
  timestamp: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: 'plus' | 'folder-add' | 'notification' | 'export';
  path: string;
  variant?: 'link' | 'export';
}

export interface AdminSettings {
  siteName: string;
  supportEmail: string;
  defaultLanguage: string;
  timezone: string;
  enableNotifications: boolean;
  enablePublicRegistration: boolean;
  maintenanceMode: boolean;
}

export interface DashboardData {
  stats: StatMetric[];
  upcomingEvents: AdminEvent[];
  analyticsChart: AnalyticsDataPoint[];
  analyticsSummary: AnalyticsSummary;
  categoryDistribution: CategoryDistribution[];
  recentActivity: ActivityItem[];
  quickActions: QuickAction[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
