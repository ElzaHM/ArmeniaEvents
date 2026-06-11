import { Button, Tag, Typography } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { formatEventDate, formatEventTime, formatFullDate, openGoogleCalendarEvent, parseEventDate } from '../events/eventDateUtils';
import type { EventDetails } from './types';

import styles from './EventInfo.module.css';

interface EventInfoProps {
  event: EventDetails;
}

type InfoItem = {
  icon: typeof CalendarOutlined;
  label: string;
  value: string;
  extra?: string;
  onExtraClick?: () => void;
  extraDisabled?: boolean;
};

export default function EventInfo({ event }: EventInfoProps) {
  const hasEndDate = Boolean(event.endDate && parseEventDate(event.endDate));
  const hasValidStartDate = Boolean(parseEventDate(event.date));
  const durationValue =
    event.duration?.trim() ||
    (hasValidStartDate && event.time && event.time !== 'Date TBD'
      ? event.time
      : hasValidStartDate
        ? formatEventTime(event.date)
        : 'Not specified');

  const handleAddToCalendar = () => {
    openGoogleCalendarEvent({
      title: event.title,
      startDate: event.date,
      endDate: event.endDate,
      location: event.location,
      description: event.description,
    });
  };

  const infoItems: InfoItem[] = [
    {
      icon: CalendarOutlined,
      label: 'Date',
      value: formatEventDate(event.date),
      extra: 'Add to Calendar',
      onExtraClick: handleAddToCalendar,
      extraDisabled: !hasValidStartDate,
    },
    ...(hasEndDate
      ? [
          {
            icon: CalendarOutlined,
            label: 'Ends',
            value: formatFullDate(event.endDate, event.endTime),
          },
        ]
      : []),
    {
      icon: ClockCircleOutlined,
      label: 'Start Time',
      value: durationValue,
    },
    {
      icon: TeamOutlined,
      label: 'Attendees',
      value: `${event.interestedCount ?? 0} interested`,
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
                  <Button
                    type="default"
                    size="small"
                    icon={<CalendarOutlined />}
                    className={styles.calendarBtn}
                    onClick={item.onExtraClick}
                    disabled={item.extraDisabled}
                  >
                    {item.extra}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}