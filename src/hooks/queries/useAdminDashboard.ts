import { useQuery } from '@tanstack/react-query';

import {
  getAnalyticsOverview,
  getCategoryDistribution,
  getDashboardStats,
  getRecentActivityFromEvents,
  fetchEventSearchCount,
} from '../../services/admin-analytics.service';
import {
  fetchAdminEvents,
  fetchUpcomingAdminEvents,
} from '../../services/admin-events.service';

export const adminDashboardKeys = {
  all: ['admin'] as const,
  stats: ['admin', 'stats'] as const,
  events: (query?: string) => ['admin', 'events', query ?? ''] as const,
  upcoming: ['admin', 'events', 'upcoming'] as const,
  categories: ['admin', 'categories-distribution'] as const,
  activity: ['admin', 'recent-activity'] as const,
  analytics: ['admin', 'analytics-overview'] as const,
  searchCount: (query: string) => ['admin', 'search', 'events-count', query] as const,
};

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: adminDashboardKeys.stats,
    queryFn: getDashboardStats,
  });
}

export function useAdminEventsList(searchQuery?: string) {
  return useQuery({
    queryKey: adminDashboardKeys.events(searchQuery),
    queryFn: () => fetchAdminEvents(searchQuery),
  });
}

export function useAdminUpcomingEvents() {
  return useQuery({
    queryKey: adminDashboardKeys.upcoming,
    queryFn: () => fetchUpcomingAdminEvents(),
  });
}

export function useAdminCategoryDistribution() {
  return useQuery({
    queryKey: adminDashboardKeys.categories,
    queryFn: getCategoryDistribution,
  });
}

export function useAdminRecentActivity() {
  return useQuery({
    queryKey: adminDashboardKeys.activity,
    queryFn: getRecentActivityFromEvents,
  });
}

export function useAdminAnalyticsOverview() {
  return useQuery({
    queryKey: adminDashboardKeys.analytics,
    queryFn: getAnalyticsOverview,
  });
}

export function useAdminEventSearchCount(query: string, enabled: boolean) {
  return useQuery({
    queryKey: adminDashboardKeys.searchCount(query),
    enabled,
    queryFn: () => fetchEventSearchCount(query),
  });
}
