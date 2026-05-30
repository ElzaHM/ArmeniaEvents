import EventSection from './EventSection';
import { TOP_PICKS } from './mockData';

export default function TopPicks() {
  return <EventSection title="Top Picks for You" events={TOP_PICKS} />;
}
