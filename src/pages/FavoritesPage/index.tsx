import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from 'antd';

import EventCard from '../../components/home/EventCard';
import FooterContent from '../../components/home/FooterContent';
import '../../components/home/home.css';
import { QueryState } from '../../hooks/queries/query-state';
import { useUserFavoriteEvents } from '../../hooks/queries/useFavorite';

import styles from './FavoritesPage.module.css';

const { Title, Paragraph } = Typography;
const INITIAL_VISIBLE_COUNT = 10;

export default function FavoritesPage() {
  const [showAll, setShowAll] = useState(false);
  const favoriteEventsQuery = useUserFavoriteEvents();
  const favoriteEvents = favoriteEventsQuery.data ?? [];
  const hasMore = favoriteEvents.length > INITIAL_VISIBLE_COUNT;
  const visibleEvents = showAll
    ? favoriteEvents
    : favoriteEvents.slice(0, INITIAL_VISIBLE_COUNT);

  return (
    <div className={`${styles.pageWrapper} favorites-page`}>
      <div className="mainContent">
        <div className={styles.heroHeader}>
          <Title className={styles.mainTitle}>
            My Favorite <span className={styles.goldText}>Events</span>
          </Title>
          <div className={styles.goldUnderline}></div>
          <Paragraph className={styles.heroSubtitle}>
            Your saved events in one place. Browse, revisit, and never miss the experiences you love.
          </Paragraph>
        </div>

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
            <>
              <div className={styles.grid}>
                {visibleEvents.map((event) => (
                  <div key={event.id} className={styles.cardWrap}>
                    <Link to={`/events/${event.id}`} className={styles.cardLink}>
                      <EventCard event={event} />
                    </Link>
                  </div>
                ))}
              </div>
              {hasMore && !showAll ? (
                <div className={styles.moreWrap}>
                  <Button
                    type="primary"
                    size="large"
                    className={styles.moreBtn}
                    onClick={() => setShowAll(true)}
                  >
                    More
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </QueryState>
      </div>
      <div className={styles.footer}>
        <FooterContent />
      </div>
    </div>
  );
}

