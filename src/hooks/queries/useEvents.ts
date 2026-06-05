import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { EventItem } from '../../components/home/types';
import { eventsService } from '../../services/events.service';

export const eventsKeys = {
  all: ['events'] as const,
  detail: (id: string | undefined) => ['events', id] as const,
  upcoming: ['events', 'upcoming'] as const,
  topPicks: ['events', 'top-picks'] as const,
  related: ['events', 'related'] as const,
  filters: ['events', 'filters'] as const,
  totalCount: ['events', 'total-count'] as const,
  popularTags: ['events', 'popular-tags'] as const,
  benefits: ['events', 'benefits'] as const,
  footerQuickLinks: ['events', 'footer-quick-links'] as const,
  interestedAvatars: ['events', 'interested-avatars'] as const,
  tabs: ['events', 'tabs'] as const,
};

type EventCreatePayload = Parameters<typeof eventsService.createEvent>[0];
type EventUpdatePayload = Parameters<typeof eventsService.updateEvent>[1];

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

export function useRelatedEvents(eventId: string | undefined, category: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...eventsKeys.related, eventId, category] as const,
    enabled: Boolean(eventId && category),
    queryFn: async () => {
      const cached = queryClient.getQueryData<EventItem[]>(eventsKeys.all);
      const events = cached ?? (await eventsService.getEvents());
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

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EventCreatePayload) => eventsService.createEvent(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventsKeys.all });
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
      void queryClient.invalidateQueries({ queryKey: eventsKeys.totalCount });
    },
  });
}
