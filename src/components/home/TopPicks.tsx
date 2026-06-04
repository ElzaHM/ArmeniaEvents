import EventSection from './EventSection';
import { QueryState } from '../../hooks/queries/query-state';
import { useTopPicks } from '../../hooks/queries/useEvents';

export default function TopPicks() {
  const { data: events, isLoading, isError, error } = useTopPicks();

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      {events && <EventSection title="Top Picks for You" events={events} />}
    </QueryState>
  );
}
