import { Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import type { EventDetails } from './types';

import styles from './EventSchedule.module.css';

interface EventScheduleProps {
  event: EventDetails;
}

export default function EventSchedule({ event }: EventScheduleProps) {
  return (
    <section className={`${styles.section} detailsGlassCard`}>
      <Typography.Title level={4} className={styles.title}>
        Schedule
      </Typography.Title>

      <div className={styles.dayToggles}>
        {event.scheduleDays.map((day, index) => (
          <button
            key={day.date}
            type="button"
            className={`${styles.dayCard} ${index === 0 ? styles.dayCardActive : ''}`}
          >
            <span className={styles.dayLabel}>{day.label}</span>
            <span className={styles.dayWeekday}>{day.weekday}</span>
          </button>
        ))}
      </div>

      <div className={styles.timeline}>
        {event.schedule.map((item) => (
          <div key={`${item.time}-${item.title}`} className={styles.timelineItem}>
            <div className={styles.timelineMarker} />
            <div className={styles.timelineContent}>
              <Typography.Text className={styles.timelineTime}>{item.time}</Typography.Text>
              <Typography.Text className={styles.timelineTitle}>{item.title}</Typography.Text>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className={styles.viewAll}>
        View Full Schedule
        <ArrowRightOutlined />
      </button>
    </section>
  );
}
