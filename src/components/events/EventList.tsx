import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Select, Typography } from 'antd';
import {
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

import { QueryState } from '../../hooks/queries/query-state';
import { useEvents } from '../../hooks/queries/useEvents';
import type { EventItem } from '../home/types';
import { getDateSortValue, parseEventDate } from './eventDateUtils';
import { SORT_OPTIONS } from './mockData';
import EventListItem from './EventListItem';
import EventPagination from './EventPagination';

import styles from './EventList.module.css';

const PAGE_SIZE = 8;

type ViewMode = 'list' | 'grid';

type EventWithFilterFields = EventItem & {
  eventType?: string;
  language?: string;
  organizer?: string;
};

interface EventListProps {
  appliedCategories?: string[];
  appliedEventType?: string | null;
  appliedLanguage?: string | null;
  appliedPriceRange?: 'free' | 'paid' | null;
  appliedOrganizer?: string | null;
  appliedDateRange?: { from: string; to: string } | null;
}

function filterEventsByQuery(events: EventItem[], query: string): EventItem[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return events;
  }

  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(needle) ||
      event.category.toLowerCase().includes(needle) ||
      event.location.toLowerCase().includes(needle),
  );
}

function filterEventsByCategories(events: EventItem[], categories: string[]): EventItem[] {
  if (categories.length === 0) {
    return events;
  }

  return events.filter((event) => categories.includes(event.category));
}

function filterEventsByEventType(
  events: EventWithFilterFields[],
  eventType: string | null | undefined,
): EventWithFilterFields[] {
  if (!eventType) {
    return events;
  }

  return events.filter((event) => event.eventType === eventType);
}

function filterEventsByLanguage(
  events: EventWithFilterFields[],
  language: string | null | undefined,
): EventWithFilterFields[] {
  if (!language) {
    return events;
  }

  return events.filter((event) => event.language === language);
}

function filterEventsByPriceRange(
  events: EventWithFilterFields[],
  priceRange: 'free' | 'paid' | null | undefined,
): EventWithFilterFields[] {
  if (!priceRange) {
    return events;
  }

  if (priceRange === 'free') {
    return events.filter((event) => event.isFree === true);
  }

  return events.filter((event) => event.isFree === false);
}

function filterEventsByOrganizer(
  events: EventWithFilterFields[],
  organizer: string | null | undefined,
): EventWithFilterFields[] {
  if (!organizer) {
    return events;
  }

  return events.filter((event) => event.organizer === organizer);
}

function getInclusiveDateRangeEnd(dateString: string): number {
  const date = parseEventDate(dateString);
  if (!date) {
    return getDateSortValue(dateString);
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  ).getTime();
}

function filterEventsByDateRange(
  events: EventWithFilterFields[],
  dateRange: { from: string; to: string } | null | undefined,
): EventWithFilterFields[] {
  if (!dateRange) {
    return events;
  }

  const fromValue = getDateSortValue(dateRange.from);
  const toValue = getInclusiveDateRangeEnd(dateRange.to);

  if (fromValue === 0 || toValue === 0) {
    return events;
  }

  return events.filter((event) => {
    const eventValue = getDateSortValue(event.date);
    return eventValue >= fromValue && eventValue <= toValue;
  });
}

function sortEvents(events: EventItem[], sortBy: string): EventItem[] {
  const sorted = [...events];

  if (sortBy === 'date-oldest') {
    return sorted.sort((left, right) => getDateSortValue(left.date) - getDateSortValue(right.date));
  }

  return sorted.sort((left, right) => getDateSortValue(right.date) - getDateSortValue(left.date));
}

export default function EventList({
  appliedCategories = [],
  appliedEventType = null,
  appliedLanguage = null,
  appliedPriceRange = null,
  appliedOrganizer = null,
  appliedDateRange = null,
}: EventListProps) {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') ?? '';

  const eventsQuery = useEvents();

  const isLoading = eventsQuery.isLoading;
  const isError = eventsQuery.isError;
  const error = eventsQuery.error;

  const allEvents = eventsQuery.data;

  const [sortBy, setSortBy] = useState('date-newest');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEvents = useMemo(() => {
    if (!allEvents) {
      return [];
    }

    const eventsWithFilters = allEvents as EventWithFilterFields[];
    const byCategory = filterEventsByCategories(eventsWithFilters, appliedCategories);
    const byEventType = filterEventsByEventType(byCategory as EventWithFilterFields[], appliedEventType);
    const byLanguage = filterEventsByLanguage(byEventType, appliedLanguage);
    const byPriceRange = filterEventsByPriceRange(byLanguage, appliedPriceRange);
    const byOrganizer = filterEventsByOrganizer(byPriceRange, appliedOrganizer);
    const byDateRange = filterEventsByDateRange(byOrganizer, appliedDateRange);
    const byQuery = filterEventsByQuery(byDateRange, searchQuery);
    return sortEvents(byQuery, sortBy);
  }, [
    allEvents,
    appliedCategories,
    appliedEventType,
    appliedLanguage,
    appliedPriceRange,
    appliedOrganizer,
    appliedDateRange,
    searchQuery,
    sortBy,
  ]);

  const filteredCount = filteredEvents.length;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    appliedCategories,
    appliedEventType,
    appliedLanguage,
    appliedPriceRange,
    appliedOrganizer,
    appliedDateRange,
    sortBy,
  ]);

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredEvents.slice(start, start + PAGE_SIZE);
  }, [filteredEvents, currentPage]);

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      {allEvents && (
        <section className={`${styles.listSection} eventsListPanel`}>
          <div className={styles.toolbar}>
            <Typography.Text className={styles.resultCount}>
              Found <strong>{filteredCount}</strong> events
            </Typography.Text>

            <div className={styles.toolbarActions}>
              <div className={styles.sortSelectWrap}>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  options={SORT_OPTIONS}
                  variant="borderless"
                  className={`${styles.sortSelect} eventsSortField`}
                />
              </div>

              <div className={`${styles.viewToggle} eventsViewToggle`}>
                <Button
                  type={viewMode === 'grid' ? 'primary' : 'default'}
                  icon={<AppstoreOutlined />}
                  aria-label="Grid view"
                  onClick={() => setViewMode('grid')}
                />
                <Button
                  type={viewMode === 'list' ? 'primary' : 'default'}
                  icon={<UnorderedListOutlined />}
                  aria-label="List view"
                  onClick={() => setViewMode('list')}
                />
              </div>
            </div>
          </div>

          <div className={viewMode === 'list' ? styles.list : styles.grid}>
            {paginatedEvents.map((event) => (
              <EventListItem key={event.id} event={event} variant={viewMode} />
            ))}
          </div>

          <EventPagination
            current={currentPage}
            total={filteredCount}
            pageSize={PAGE_SIZE}
            onChange={setCurrentPage}
          />
        </section>
      )}
    </QueryState>
  );
}
