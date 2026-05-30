import { useRef } from 'react';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import EventCard from './EventCard';
import SectionHeader from './SectionHeader';
import type { EventItem } from './types';

import styles from './EventSection.module.css';

interface EventSectionProps {
  title: string;
  events: EventItem[];
  viewAllHref?: string;
}

export default function EventSection({ title, events, viewAllHref }: EventSectionProps) {
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
      <div className="homeSection">
        <div className={styles.headerRow}>
          <SectionHeader title={title} viewAllHref={viewAllHref} className={styles.sectionHeader} />
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
          {events.map((event) => (
            <div key={event.id} className={styles.cardWrap}>
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
