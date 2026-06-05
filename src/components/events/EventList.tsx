import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Select, Typography } from 'antd';
import {
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

import { QueryState } from '../../hooks/queries/query-state';
import { useEvents, useSortOptions } from '../../hooks/queries/useEvents';
import type { EventItem } from '../home/types';
import EventListItem from './EventListItem';
import EventPagination from './EventPagination';

import styles from './EventList.module.css';

const PAGE_SIZE = 8;

type ViewMode = 'list' | 'grid';

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

export default function EventList() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') ?? '';

  const eventsQuery = useEvents();
  const sortOptionsQuery = useSortOptions();

  const isLoading = eventsQuery.isLoading || sortOptionsQuery.isLoading;
  const isError = eventsQuery.isError || sortOptionsQuery.isError;
  const error = eventsQuery.error ?? sortOptionsQuery.error;

  const allEvents = eventsQuery.data;
  const sortOptions = sortOptionsQuery.data;

  const [sortBy, setSortBy] = useState('date-newest');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEvents = useMemo(() => {
    if (!allEvents) {
      return [];
    }
    return filterEventsByQuery(allEvents, searchQuery);
  }, [allEvents, searchQuery]);

  const filteredCount = filteredEvents.length;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredEvents.slice(start, start + PAGE_SIZE);
  }, [filteredEvents, currentPage]);

  return (
      <QueryState isLoading={isLoading} isError={isError} error={error}>
        {allEvents && sortOptions && (
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
                    options={sortOptions}
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
