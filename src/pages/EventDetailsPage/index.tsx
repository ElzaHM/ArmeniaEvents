import { Link, useParams } from 'react-router-dom';
//import { ArrowLeftOutlined } from '@ant-design/icons';

import {
  EventHero,
  EventInfo,
  EventSchedule,
  EventTabs,
  EventVenue,
  getEventDetails,
  OrganizerCard,
  RelatedEvents,
  ReminderCard,
  TicketPanel,
} from '../../components/event-details';
import '../../components/home/home.css';
import '../../components/event-details/event-details.css';

import pageStyles from '../../components/event-details/EventDetails.module.css';

export default function EventDetailsPage() {
  const { id } = useParams();
  const event = getEventDetails(id);

  return (
    <div className={pageStyles.detailsPage}>
      <div className={pageStyles.backBar}>
        <Link to="/events" className={pageStyles.backLink}>
         {/*  <ArrowLeftOutlined /> */}
         
        </Link>
      </div>

      <EventHero event={event} />

      <div className={pageStyles.tabsWrap}>
        <div className="detailsSection">
          <EventTabs />
        </div>
      </div>

      <div className={`detailsSection ${pageStyles.main}`}>
        <div className={pageStyles.mainContent}>
          <EventInfo event={event} />
          <EventSchedule event={event} />
          <EventVenue event={event} />
        </div>

        <aside className={pageStyles.sidebar}>
          <TicketPanel event={event} />
          <OrganizerCard event={event} />
          <ReminderCard />
        </aside>
      </div>

      <RelatedEvents />
    </div>
  );
}
