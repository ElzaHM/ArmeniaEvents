import { Tag, Typography } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

import type { EventDetails } from './types';

import styles from './EventInfo.module.css';

interface EventInfoProps {
  event: EventDetails;
}

function formatFullDate(dateString: string, time: string) {
  const date = new Date(dateString);

  const formatted = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return `${formatted} • ${time}`;
}

export default function EventInfo({ event }: EventInfoProps) {
  const infoItems = [
    {
      icon: CalendarOutlined,
      label: 'Date & Time',
      value: formatFullDate(event.date, event.time),
      extra: 'Add to Calendar',
    },
    {
      icon: ClockCircleOutlined,
      label: 'Duration',
      value: event.duration ?? 'N/A',
    },
    {
      icon: TeamOutlined,
      label: 'Attendees',
      value: `${event.interestedCount ?? 0} interested / ${event.goingCount ?? 0} going`,
    },
    {
      icon: GlobalOutlined,
      label: 'Event Type',
      value: event.eventType ?? 'Offline',
    },
    {
      icon: GlobalOutlined,
      label: 'Language',
      value: event.languages ?? 'English',
    },
    {
      icon: UserOutlined,
      label: 'Age Range',
      value: event.ageRange ?? 'All ages',
    },
  ];

  return (
    <section className={`${styles.section} detailsGlassCard`}>
      <Typography.Title level={4} className={styles.title}>
        About This Event
      </Typography.Title>

      {(event.description ?? []).map((paragraph) => (
        <Typography.Paragraph
          key={paragraph.slice(0, 32)}
          className={styles.description}
        >
          {paragraph}
        </Typography.Paragraph>
      ))}

      <div className={styles.tags}>
        {(event.tags ?? []).map((tag) => (
          <Tag key={tag} className={styles.tag}>
            {tag}
          </Tag>
        ))}
      </div>

      <div className={styles.infoGrid}>
        {infoItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className={styles.infoItem}>
              <Icon className={styles.infoIcon} />

              <div className={styles.infoContent}>
                <Typography.Text className={styles.infoLabel}>
                  {item.label}
                </Typography.Text>

                <Typography.Text className={styles.infoValue}>
                  {item.value}
                </Typography.Text>

                {item.extra && (
                  <button type="button" className={styles.infoExtra}>
                    {item.extra}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}