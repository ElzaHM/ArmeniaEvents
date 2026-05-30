import EventSection from './EventSection';
import { UPCOMING_EVENTS } from './mockData';

export default function UpcomingEvents() {
  return <EventSection title="Upcoming Events" events={UPCOMING_EVENTS} />;
}
