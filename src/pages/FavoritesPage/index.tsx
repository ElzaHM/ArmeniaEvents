import { Link } from 'react-router-dom';
import { Typography } from 'antd';

import EventCard from '../../components/home/EventCard';
import '../../components/home/home.css';
import { QueryState } from '../../hooks/queries/query-state';
import { useUserFavoriteEvents } from '../../hooks/queries/useFavorite';

import styles from './FavoritesPage.module.css';

export default function FavoritesPage() {
  const favoriteEventsQuery = useUserFavoriteEvents();
  const favoriteEvents = favoriteEventsQuery.data ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Typography.Title level={1} className={styles.title}>
          My Favorite Events
        </Typography.Title>

        <QueryState
          isLoading={favoriteEventsQuery.isLoading}
          isError={favoriteEventsQuery.isError}
          error={favoriteEventsQuery.error}
        >
          {favoriteEvents.length === 0 ? (
            <Typography.Paragraph className={styles.empty}>
              You don&apos;t have any favorite events yet.
              <br />
              Start exploring events and click the heart icon to save events here.
            </Typography.Paragraph>
          ) : (
            <div className={styles.grid}>
              {favoriteEvents.map((event) => (
                <Link key={event.id} to={`/events/${event.id}`} className={styles.cardLink}>
                  <EventCard event={event} />
                </Link>
              ))}
            </div>
          )}
        </QueryState>
      </div>
    </div>
  );
}
