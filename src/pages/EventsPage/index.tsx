import { EventFilters, EventList, EventSearch } from '../../components/events';
import '../../components/home/home.css';
import '../../components/events/events.css';

import pageStyles from '../../components/events/EventsPage.module.css';

export default function EventsPage() {
  return (
    <div className={`${pageStyles.eventsPage} eventsPage`}>
      <EventSearch />
      <div className={pageStyles.main}>
        <div className={pageStyles.sidebar}>
          <EventFilters />
        </div>
        <div className={pageStyles.content}>
          <EventList />
        </div>
      </div>
    </div>
  );
}
