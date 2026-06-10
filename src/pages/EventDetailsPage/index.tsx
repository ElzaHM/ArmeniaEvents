import { Link, useParams } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';

import {
  CountdownCard,
  EventHero,
  EventInfo,
  EventSchedule,
  EventTabs,
  EventVenue,
  OrganizerCard,
  RelatedEvents,
  ReminderCard,
  TicketPanel,
} from '../../components/event-details';
import '../../components/home/home.css';
import '../../components/event-details/event-details.css';
import { QueryState } from '../../hooks/queries/query-state';
import { useEvent } from '../../hooks/queries/useEvent';

import pageStyles from '../../components/event-details/EventDetails.module.css';

function hasScheduleData(event: {
  schedule?: { time: string; title: string }[];
  scheduleDays?: { date: string; label: string; weekday: string }[];
}) {
  return (event.schedule?.length ?? 0) > 0 || (event.scheduleDays?.length ?? 0) > 0;
}

export default function EventDetailsPage() {
  const { id } = useParams();
  const { data: event, isLoading, isError, error } = useEvent(id);

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error} minHeight={240}>
      {event && (
        <div className={pageStyles.detailsPage}>
          <div className={`detailsSection ${pageStyles.backBar}`}>
            <Link to="/events" className={pageStyles.backLink}>
              <LeftOutlined />
              Back to Events
            </Link>
          </div>

          <EventHero event={event} />

          <div className={pageStyles.tabsWrap}>
            <div className="detailsSection">
              <EventTabs event={event} />
            </div>
          </div>

          <div className={`detailsSection ${pageStyles.main}`}>
            <div className={pageStyles.mainContent}>
              <CountdownCard startDate={event.date} />
              <EventInfo event={event} />
              {hasScheduleData(event) ? <EventSchedule event={event} /> : null}
              <div id="event-venue">
                <EventVenue event={event} />
              </div>
            </div>

            <aside className={pageStyles.sidebar}>
              {event.isFree || event.ticketUrl || (!event.isFree && !event.ticketUrl) ? (
                <TicketPanel event={event} />
              ) : null}
              <OrganizerCard event={event} />
              <ReminderCard eventId={event.id} />
            </aside>
          </div>

          <RelatedEvents eventId={event.id} category={event.category} />
        </div>
      )}
    </QueryState>
  );
}
