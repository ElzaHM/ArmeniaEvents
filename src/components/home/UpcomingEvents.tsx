import EventSection from './EventSection';
import { QueryState } from '../../hooks/queries/query-state';
import { useUpcomingEvents } from '../../hooks/queries/useEvents';

export default function UpcomingEvents() {
  const { data: events, isLoading, isError, error } = useUpcomingEvents();

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      {events && <EventSection title="Upcoming Events" events={events} />}
    </QueryState>
  );
}
