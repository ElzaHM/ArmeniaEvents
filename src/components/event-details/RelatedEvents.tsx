import { useRef } from 'react';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import { QueryState } from '../../hooks/queries/query-state';
import { useRelatedEvents } from '../../hooks/queries/useEvents';
import EventListItem from '../events/EventListItem';
import SectionHeader from '../home/SectionHeader';

import styles from './RelatedEvents.module.css';

interface RelatedEventsProps {
  eventId: string;
  category: string;
}

export default function RelatedEvents({ eventId, category }: RelatedEventsProps) {
  const { data: relatedEvents, isLoading, isError, error } = useRelatedEvents(eventId, category);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const firstCard = container.firstElementChild as HTMLElement | null;
    const gap = 20;
    const scrollAmount = firstCard?.offsetWidth
      ? firstCard.offsetWidth + gap
      : container.clientWidth * 0.85;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!isLoading && !isError && relatedEvents?.length === 0) {
    return null;
  }

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      {relatedEvents && relatedEvents.length > 0 && (
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
                  <EventListItem event={event} variant="grid" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </QueryState>
  );
}
