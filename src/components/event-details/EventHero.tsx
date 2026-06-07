import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Tag, Typography, message } from 'antd';
import {
  EnvironmentOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
} from '@ant-design/icons';

import { useFavoriteStatus, useToggleFavorite } from '../../hooks/queries/useFavorite';
import { useAuth } from '../../hooks/useAuth';
import { formatDateBadge } from '../events/eventDateUtils';
import type { EventDetails } from './types';

import styles from './EventHero.module.css';

interface EventHeroProps {
  event: EventDetails;
}

export default function EventHero({ event }: EventHeroProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: favoriteStatus } = useFavoriteStatus(event.id);
  const toggleFavorite = useToggleFavorite(event.id);
  const { month, day } = useMemo(() => formatDateBadge(event.date), [event.date]);

  const isSaved = favoriteStatus?.favorited ?? false;

  const handleSave = () => {
    if (!isAuthenticated) {
      navigate('/sign-in');
      return;
    }

    toggleFavorite.mutate();
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      message.success('Link copied to clipboard');
    } catch {
      message.error('Unable to copy link');
    }
  };

  return (
    <section className={styles.hero}>
      <div className="detailsSection">
        <div className={styles.layout}>
          <div className={styles.info}>
            <div className={styles.dateCard}>
              <span className={styles.dateMonth}>{month}</span>
              <span className={styles.dateDay}>{day}</span>
              <span className={styles.dateWeekday}>{event.weekday ?? ''}</span>
              <span className={styles.dateTime}>{event.time}</span>
            </div>

            <Tag className={styles.category}>{event.category}</Tag>

            <Typography.Title level={1} className={styles.title}>
              {event.title}
            </Typography.Title>

            <Typography.Text className={styles.location}>
              <EnvironmentOutlined />
              {event.location}
            </Typography.Text>

            <div className={styles.interested}>
              <Typography.Text className={styles.interestedText}>
                {event.interestedCount ?? 0} people are interested
              </Typography.Text>
            </div>

            <div className={styles.actions}>
              {event.ticketUrl ? (
                <Button
                  type="primary"
                  size="large"
                  className={styles.primaryBtn}
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Tickets
                </Button>
              ) : null}
              <Button
                size="large"
                icon={isSaved ? <HeartFilled /> : <HeartOutlined />}
                className={styles.secondaryBtn}
                onClick={handleSave}
                loading={toggleFavorite.isPending}
              >
                Save Event
              </Button>
              <Button
                size="large"
                icon={<ShareAltOutlined />}
                className={styles.secondaryBtn}
                onClick={handleShare}
              >
                Share
              </Button>
            </div>
          </div>

          <div className={styles.imageWrap}>
            <img src={event.imageUrl} alt={event.title} className={styles.image} />
            <Button
              type="text"
              shape="circle"
              aria-label="Save event"
              icon={isSaved ? <HeartFilled className={styles.imageHeartActive} /> : <HeartOutlined />}
              className={styles.imageFavorite}
              onClick={handleSave}
              loading={toggleFavorite.isPending}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
