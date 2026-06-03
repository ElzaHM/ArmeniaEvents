import { useRef } from 'react';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import EventCard from './EventCard';
import type { EventItem } from './types';
import { useTheme } from '../../hooks/useTheme'; 
// import homePageBg from '../../assets/homePageBzg.png'; 
// import homePageBgLight from '../../assets/eventPageLigthBg.png';
import styles from './EventSection.module.css';

interface EventSectionProps {
  title: string;
  events: EventItem[];
  viewAllHref?: string;
}

export default function EventSection({ title, events, viewAllHref }: EventSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  //   const { mode } = useTheme(); 
  //  const bgImage = mode === 'light' ? homePageBgLight : homePageBg;

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
    <section className={styles.section} >
    <section className={styles.sectionOverlay}>
      {/* <div><PopularCategories/></div> */}
    <div className="homeSection">
      {/* Header բաժինը */}
      <div className={styles.headerRow}>
        <h2 className={styles.title}>{title}</h2>
        {viewAllHref && (
          <a href={viewAllHref} className={styles.viewAll}>
            View all <RightOutlined style={{ fontSize: 12, marginLeft: 6 }} />
          </a>
        )}
      </div>

      <div className={styles.relativeWrapper}>
        {/* Ձախ կոճակը (հայտնվում է միայն սքրոլ անելիս) */}
        <Button
          className={`${styles.navButton} ${styles.leftBtn}`}
          shape="circle"
          icon={<LeftOutlined />}
          onClick={() => scroll('left')}
        />

        <div ref={scrollRef} className={styles.scrollContainer}>
          {events.map((event) => (
            <div key={event.id} className={styles.cardWrap}>
              <EventCard event={event} />
            </div>
          ))}
        </div>

        {/* Աջ կոճակը (այն սպիտակ կլորը, որը նկարում է) */}
        <Button
          className={`${styles.navButton} ${styles.rightBtn}`}
          shape="circle"
          icon={<RightOutlined />}
          onClick={() => scroll('right')}
        />
      </div>
    </div>
    </section>
  </section>
);
}
