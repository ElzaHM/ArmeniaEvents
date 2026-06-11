import { QueryState } from '../../hooks/queries/query-state';
import { useEventTabs } from '../../hooks/queries/useEvents';
import { openGoogleCalendarEvent, parseEventDate } from '../events/eventDateUtils';
import type { EventDetails } from './types';

import styles from './EventTabs.module.css';

const ADD_TO_CALENDAR_TAB = 'Add to Calendar';
const VENUE_TAB = 'Venue';
const OPEN_IN_MAPS_TAB = 'Open in Maps';
const GALLERY_TAB = 'Gallery';
const EVENT_VENUE_SECTION_ID = 'event-venue';
const SCROLL_OFFSET = 96;

interface EventTabsProps {
  event: EventDetails;
}

export default function EventTabs({ event }: EventTabsProps) {
  const { data: eventTabs, isLoading, isError, error } = useEventTabs();
  const hasValidStartDate = Boolean(parseEventDate(event.date));

  const venue = event.venue ?? {
    name: 'Event Venue',
    address: event.location,
    imageUrl: event.imageUrl,
    website: '',
    phone: '',
    email: '',
  };

  const mapsQuery = venue.address?.trim() || event.location?.trim() || '';
  const hasValidLocation = mapsQuery.length > 0;

  const handleAddToCalendar = () => {
    openGoogleCalendarEvent({
      title: event.title,
      startDate: event.date,
      endDate: event.endDate,
      location: event.location,
      description: event.description,
    });
  };

  const handleScrollToVenue = () => {
    const venueSection = document.getElementById(EVENT_VENUE_SECTION_ID);
    if (!venueSection) {
      return;
    }

    const top = venueSection.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const handleOpenInMaps = () => {
    if (!hasValidLocation) {
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getTabClickHandler = (tab: string) => {
    if (tab === ADD_TO_CALENDAR_TAB) {
      return handleAddToCalendar;
    }

    if (tab === VENUE_TAB) {
      return handleScrollToVenue;
    }

    if (tab === OPEN_IN_MAPS_TAB) {
      return handleOpenInMaps;
    }

    return undefined;
  };

  const isTabDisabled = (tab: string) => {
    if (tab === ADD_TO_CALENDAR_TAB) {
      return !hasValidStartDate;
    }

    if (tab === OPEN_IN_MAPS_TAB) {
      return !hasValidLocation;
    }

    return false;
  };

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error} minHeight={48}>
      {eventTabs && (
        <nav className={styles.tabs} aria-label="Event sections">
          {eventTabs
            .filter((tab) => tab !== GALLERY_TAB)
            .map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`${styles.tab} ${index === 0 ? styles.tabActive : ''}`}
              onClick={getTabClickHandler(tab)}
              disabled={isTabDisabled(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      )}
    </QueryState>
  );
}
