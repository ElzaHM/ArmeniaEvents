import { useQuery } from '@tanstack/react-query';

import { eventsService } from '../../services/events.service';
import { eventsKeys } from './useEvents';

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: eventsKeys.detail(id),
    queryFn: () => eventsService.getEventById(id),
    enabled: Boolean(id),
  });
}
