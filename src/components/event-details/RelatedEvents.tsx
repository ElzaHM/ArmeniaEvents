import { useRef } from 'react';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import { QueryState } from '../../hooks/queries/query-state';
import { useRelatedEvents } from '../../hooks/queries/useEvents';
import EventCard from '../home/EventCard';
import SectionHeader from '../home/SectionHeader';

import styles from './RelatedEvents.module.css';

export default function RelatedEvents() {
  const { data: relatedEvents, isLoading, isError, error } = useRelatedEvents();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.85;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      {relatedEvents && (
        <section className={styles.section}>
          <div className="detailsSection">
            <div className={styles.headerRow}>
              <SectionHeader
                title="You May Also Like"
                viewAllHref="/events"
                className={styles.sectionHeader}
              />
              <div className={styles.navButtons}>
                <Button
                  shape="circle"
                  icon={<LeftOutlined />}
                  aria-label="Scroll left"
                  onClick={() => scroll('left')}
                />
                <Button
                  shape="circle"
                  icon={<RightOutlined />}
                  aria-label="Scroll right"
                  onClick={() => scroll('right')}
                />
              </div>
            </div>

            <div ref={scrollRef} className={styles.scrollContainer}>
              {relatedEvents.map((event) => (
                <div key={event.id} className={styles.cardWrap}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </QueryState>
  );
}
