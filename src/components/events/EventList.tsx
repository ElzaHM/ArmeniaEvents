import { useMemo, useState } from 'react';
import { Button, Select, Typography } from 'antd';
import {
  AppstoreOutlined,
  DownOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

import EventListItem from './EventListItem';
import EventPagination from './EventPagination';
import { ALL_EVENTS, SORT_OPTIONS, TOTAL_EVENTS } from './mockData';

import styles from './EventList.module.css';

const PAGE_SIZE = 8;

type ViewMode = 'list' | 'grid';

export default function EventList() {
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0].value);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return ALL_EVENTS.slice(start, start + PAGE_SIZE);
  }, [currentPage]);

  return (
    <section className={`${styles.listSection} eventsListPanel`}>
      <div className={styles.toolbar}>
        <Typography.Text className={styles.resultCount}>
          Found <strong>{TOTAL_EVENTS}</strong> events
        </Typography.Text>

        <div className={styles.toolbarActions}>
          <div className={styles.sortSelectWrap}>
            <Select
              size="small"
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS}
              variant="borderless"
              className={`${styles.sortSelect} eventsSortField`}
              popupClassName="eventsFieldDropdown"
              suffixIcon={<DownOutlined />}
            />
          </div>

          <div className={`${styles.viewToggle} eventsViewToggle`}>
            <Button
              type={viewMode === 'grid' ? 'primary' : 'default'}
              icon={<AppstoreOutlined />}
              aria-label="Grid view"
              className={viewMode === 'grid' ? 'homeActionBtn' : undefined}
              onClick={() => setViewMode('grid')}
            />
            <Button
              type={viewMode === 'list' ? 'primary' : 'default'}
              icon={<UnorderedListOutlined />}
              aria-label="List view"
              className={viewMode === 'list' ? 'homeActionBtn' : undefined}
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
        total={TOTAL_EVENTS}
        pageSize={PAGE_SIZE}
        onChange={setCurrentPage}
      />
    </section>
  );
}
