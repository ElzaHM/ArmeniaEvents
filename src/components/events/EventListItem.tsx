import { useMemo, useState } from 'react';
import { Button, Typography } from 'antd';
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

import type { EventItem } from '../home/types';
import { formatDateBadge, formatEventDateTime } from './eventDateUtils';

import styles from './EventListItem.module.css';

interface EventListItemProps {
  event: EventItem;
  variant?: 'list' | 'grid';
}

export default function EventListItem({ event, variant = 'list' }: EventListItemProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { month, day } = useMemo(() => formatDateBadge(event.date), [event.date]);

  return (
    <article className={`${styles.card} ${variant === 'grid' ? styles.cardGrid : ''}`}>
      <div className={styles.imageWrap}>
        <img src={event.imageUrl} alt={event.title} className={styles.image} loading="lazy" />
        <div className={styles.dateBadge}>
          <span className={styles.dateMonth}>{month}</span>
          <span className={styles.dateDay}>{day}</span>
        </div>
        <Button
          type="text"
          shape="circle"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          icon={isFavorite ? <HeartFilled className={styles.favoriteActive} /> : <HeartOutlined />}
          className={styles.favoriteBtn}
          onClick={() => setIsFavorite((current) => !current)}
        />
      </div>

      <div className={styles.details}>
        <Typography.Title level={5} className={styles.title}>
          {event.title}
        </Typography.Title>
        <Typography.Text type="secondary" className={styles.category}>
          {event.category}
        </Typography.Text>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <EnvironmentOutlined />
            {event.location}
          </span>
          <span className={styles.metaItem}>
            <ClockCircleOutlined />
            {formatEventDateTime(event.date, event.time)}
          </span>
        </div>
        <Typography.Text
          className={`${styles.price} ${event.isFree ? styles.priceFree : styles.pricePaid}`}
        >
          {event.price}
        </Typography.Text>
      </div>

      <div className={styles.actions}>
        <Link to={`/events/${event.id}`} className={styles.detailsLink}>
          <Button type="primary" className={`homeActionBtn ${styles.detailsBtn}`}>
            View Details
          </Button>
        </Link>
      </div>
    </article>
  );
}
