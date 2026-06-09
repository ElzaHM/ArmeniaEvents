import type { MouseEvent } from 'react';
import { Typography } from 'antd';
import {
  EnvironmentOutlined,
  CalendarOutlined,
  HeartOutlined,
  HeartFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { useFavoriteStatus, useToggleFavorite } from '../../hooks/queries/useFavorite';
import { useAuth } from '../../hooks/useAuth';
import type { EventItem } from './types';
import styles from './EventCard.module.css';

interface EventCardProps {
  event: EventItem;
}

export default function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: favoriteStatus } = useFavoriteStatus(event.id);
  const toggleFavorite = useToggleFavorite(event.id);
  const isFree = event.isFree || event.price === 'Free';
  const isSaved = favoriteStatus?.favorited ?? false;

  const handleSave = (clickEvent: MouseEvent) => {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();

    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    toggleFavorite.mutate();
  };

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={event.imageUrl}
          alt={event.title}
          className={styles.image}
        />

        <div className={styles.dateBadge}>
          <span className={styles.month}>MAY</span>
          <span className={styles.day}>24</span>
        </div>

        <button
          type="button"
          className={`${styles.wishlistBtn} ${isSaved ? styles.wishlistBtnActive : ''}`}
          aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
          onClick={handleSave}
          disabled={toggleFavorite.isPending}
        >
          {isSaved ? <HeartFilled /> : <HeartOutlined />}
        </button>
      </div>

      <div className={styles.content}>
        <Typography.Title level={5} className={styles.title}>
          {event.title}
        </Typography.Title>

        <p className={styles.category}>{event.category}</p>

        <div className={styles.infoRow}>
          <EnvironmentOutlined className={styles.icon} />
          <span className={styles.infoText}>{event.location}</span>
        </div>

        <div className={styles.infoRow}>
          <CalendarOutlined className={styles.icon} />
          <span className={styles.infoText}>{event.date} • {event.time}</span>
        </div>

        <div className={`${styles.price} ${isFree ? styles.freePrice : ''}`}>
          {event.price}
        </div>
      </div>
    </article>
  );
}
