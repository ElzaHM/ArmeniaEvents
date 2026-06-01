import { useQuery } from '@tanstack/react-query';

import { eventsService } from '../../services/events.service';

export const eventsKeys = {
  all: ['events'] as const,
  detail: (id: string | undefined) => ['events', id] as const,
  upcoming: ['events', 'upcoming'] as const,
  topPicks: ['events', 'top-picks'] as const,
  related: ['events', 'related'] as const,
  filters: ['events', 'filters'] as const,
  sortOptions: ['events', 'sort-options'] as const,
  totalCount: ['events', 'total-count'] as const,
  popularTags: ['events', 'popular-tags'] as const,
  benefits: ['events', 'benefits'] as const,
  footerQuickLinks: ['events', 'footer-quick-links'] as const,
  locations: ['events', 'locations'] as const,
  interestedAvatars: ['events', 'interested-avatars'] as const,
  tabs: ['events', 'tabs'] as const,
};

export function useEvents() {
  return useQuery({
    queryKey: eventsKeys.all,
    queryFn: () => eventsService.getEvents(),
  });
}

export function useUpcomingEvents() {
  return useQuery({
    queryKey: eventsKeys.upcoming,
    queryFn: () => eventsService.getUpcomingEvents(),
  });
}

export function useTopPicks() {
  return useQuery({
    queryKey: eventsKeys.topPicks,
    queryFn: () => eventsService.getTopPicks(),
  });
}

export function useRelatedEvents() {
  return useQuery({
    queryKey: eventsKeys.related,
    queryFn: () => eventsService.getRelatedEvents(),
  });
}

export function useEventFilters() {
  return useQuery({
    queryKey: eventsKeys.filters,
    queryFn: () => eventsService.getEventFilters(),
  });
}

export function useSortOptions() {
  return useQuery({
    queryKey: eventsKeys.sortOptions,
    queryFn: () => eventsService.getSortOptions(),
  });
}

export function useTotalEventsCount() {
  return useQuery({
    queryKey: eventsKeys.totalCount,
    queryFn: () => eventsService.getTotalEventsCount(),
  });
}

export function usePopularTags() {
  return useQuery({
    queryKey: eventsKeys.popularTags,
    queryFn: () => eventsService.getPopularTags(),
  });
}

export function useBenefits() {
  return useQuery({
    queryKey: eventsKeys.benefits,
    queryFn: () => eventsService.getBenefits(),
  });
}

export function useFooterQuickLinks() {
  return useQuery({
    queryKey: eventsKeys.footerQuickLinks,
    queryFn: () => eventsService.getFooterQuickLinks(),
  });
}

export function useLocations() {
  return useQuery({
    queryKey: eventsKeys.locations,
    queryFn: () => eventsService.getLocations(),
  });
}

export function useInterestedAvatars() {
  return useQuery({
    queryKey: eventsKeys.interestedAvatars,
    queryFn: () => eventsService.getInterestedAvatars(),
  });
}

export function useEventTabs() {
  return useQuery({
    queryKey: eventsKeys.tabs,
    queryFn: () => eventsService.getEventTabs(),
  });
}
