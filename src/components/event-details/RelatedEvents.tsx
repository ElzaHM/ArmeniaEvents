import { useRef } from 'react';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import EventCard from '../home/EventCard';
import SectionHeader from '../home/SectionHeader';
import { RELATED_EVENTS } from './mockData';

import styles from './RelatedEvents.module.css';

export default function RelatedEvents() {
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
          {RELATED_EVENTS.map((event) => (
            <div key={event.id} className={styles.cardWrap}>
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
