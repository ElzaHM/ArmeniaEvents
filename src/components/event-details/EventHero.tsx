import { useMemo, useState } from 'react';
import { Button, Tag, Typography } from 'antd';
import {
  EnvironmentOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
} from '@ant-design/icons';

import { QueryState } from '../../hooks/queries/query-state';
import { useInterestedAvatars } from '../../hooks/queries/useEvents';
import { formatDateBadge } from '../events/eventDateUtils';
import type { EventDetails } from './types';

import styles from './EventHero.module.css';

interface EventHeroProps {
  event: EventDetails;
}

export default function EventHero({ event }: EventHeroProps) {
  const { data: interestedAvatars, isLoading, isError, error } = useInterestedAvatars();
  const [isSaved, setIsSaved] = useState(false);
  const { month, day } = useMemo(() => formatDateBadge(event.date), [event.date]);

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

            <QueryState isLoading={isLoading} isError={isError} error={error} minHeight={48}>
              {interestedAvatars && (
                <div className={styles.interested}>
                  <div className={styles.avatars}>
                    {interestedAvatars.map((avatar) => (
                      <img
                        key={avatar}
                        src={avatar}
                        alt=""
                        className={styles.avatar}
                      />
                    ))}
                  </div>
                  <Typography.Text className={styles.interestedText}>
                    +128 · {event.interestedCount ?? 0} people are interested
                  </Typography.Text>
                </div>
              )}
            </QueryState>

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
                onClick={() => setIsSaved((current) => !current)}
              >
                Save Event
              </Button>
              <Button size="large" icon={<ShareAltOutlined />} className={styles.secondaryBtn}>
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
              onClick={() => setIsSaved((current) => !current)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
