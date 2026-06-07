import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { eventsService, type EventsPaginatedResult } from '../../services/events.service';
import {
  createAdminEvent,
  type AdminCreateEventFormValues,
} from '../../services/admin-events.service';
import { adminDashboardKeys } from './useAdminDashboard';

type EventsListParams = {
  page?: number;
  pageSize?: number;
  q?: string;
};

export const eventsKeys = {
  all: ['events'] as const,
  list: (params: EventsListParams = {}) => ['events', params] as const,
  detail: (id: string | undefined) => ['events', id] as const,
  upcoming: ['events', 'upcoming'] as const,
  topPicks: ['events', 'top-picks'] as const,
  related: ['events', 'related'] as const,
  filters: ['events', 'filters'] as const,
  totalCount: ['events', 'total-count'] as const,
  popularTags: ['events', 'popular-tags'] as const,
  benefits: ['events', 'benefits'] as const,
  footerQuickLinks: ['events', 'footer-quick-links'] as const,
  tabs: ['events', 'tabs'] as const,
};

type EventCreatePayload = Parameters<typeof eventsService.createEvent>[0];
type EventUpdatePayload = Parameters<typeof eventsService.updateEvent>[1];

function isEventsPaginatedResult(value: unknown): value is EventsPaginatedResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    'events' in value &&
    Array.isArray((value as EventsPaginatedResult).events)
  );
}

export function useEvents(params: EventsListParams = {}) {
  const query = useQuery({
    queryKey: eventsKeys.list(params),
    queryFn: () => eventsService.getEvents(params),
  });

  return {
    ...query,
    events: query.data?.events ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? 1,
    pageSize: query.data?.pageSize ?? 20,
  };
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

export function useRelatedEvents(eventId: string | undefined, category: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...eventsKeys.related, eventId, category] as const,
    enabled: Boolean(eventId && category),
    queryFn: async () => {
      const cachedQueries = queryClient.getQueriesData<EventsPaginatedResult>({
        queryKey: eventsKeys.all,
      });
      const cached = cachedQueries
        .map(([, data]) => data)
        .find(isEventsPaginatedResult);
      const result = cached ?? (await eventsService.getEvents());
      const events = result.events ?? [];
      return eventsService.pickRelatedEvents(events, eventId!, category!, 3);
    },
  });
}

export function useEventFilters() {
  return useQuery({
    queryKey: eventsKeys.filters,
    queryFn: () => eventsService.getEventFilters(),
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

export function useEventTabs() {
  return useQuery({
    queryKey: eventsKeys.tabs,
    queryFn: () => eventsService.getEventTabs(),
  });
}

export function useCreateAdminEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      values,
      image,
    }: {
      values: AdminCreateEventFormValues;
      image: { url: string; name: string };
    }) => createAdminEvent(values, image),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventsKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminDashboardKeys.all });
      void queryClient.invalidateQueries({ queryKey: eventsKeys.totalCount });
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EventCreatePayload) => eventsService.createEvent(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventsKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminDashboardKeys.all });
      void queryClient.invalidateQueries({ queryKey: eventsKeys.totalCount });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: EventUpdatePayload }) =>
      eventsService.updateEvent(id, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: eventsKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminDashboardKeys.all });
      void queryClient.invalidateQueries({ queryKey: eventsKeys.detail(variables.id) });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventsService.deleteEvent(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventsKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminDashboardKeys.all });
      void queryClient.invalidateQueries({ queryKey: eventsKeys.totalCount });
    },
  });
}
