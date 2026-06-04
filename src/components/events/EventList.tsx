import { useMemo, useState } from 'react';
import { Button, Select, Typography } from 'antd';
import {
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

import { QueryState } from '../../hooks/queries/query-state';
import { useEvents, useSortOptions, useTotalEventsCount } from '../../hooks/queries/useEvents';
import EventListItem from './EventListItem';
import EventPagination from './EventPagination';

import styles from './EventList.module.css';

const PAGE_SIZE = 8;

type ViewMode = 'list' | 'grid';

export default function EventList() {
  const eventsQuery = useEvents();
  const sortOptionsQuery = useSortOptions();
  const totalEventsQuery = useTotalEventsCount();

  const isLoading =
    eventsQuery.isLoading || sortOptionsQuery.isLoading || totalEventsQuery.isLoading;
  const isError = eventsQuery.isError || sortOptionsQuery.isError || totalEventsQuery.isError;
  const error = eventsQuery.error ?? sortOptionsQuery.error ?? totalEventsQuery.error;

  const allEvents = eventsQuery.data;
  const sortOptions = sortOptionsQuery.data;
  const totalEvents = totalEventsQuery.data;

  const [sortBy, setSortBy] = useState('date-newest');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedEvents = useMemo(() => {
    if (!allEvents) {
      return [];
    }
    const start = (currentPage - 1) * PAGE_SIZE;
    return allEvents.slice(start, start + PAGE_SIZE);
  }, [allEvents, currentPage]);

  return (
      <QueryState isLoading={isLoading} isError={isError} error={error}>
        {allEvents && sortOptions && totalEvents !== undefined && (
          <section className={`${styles.listSection} eventsListPanel`}>
            <div className={styles.toolbar}>
              <Typography.Text className={styles.resultCount}>
                Found <strong>{totalEvents}</strong> events
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
              total={totalEvents}
              pageSize={PAGE_SIZE}
              onChange={setCurrentPage}
            />
          </section>
        )}
      </QueryState>
    );
}
