import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from 'antd';

import EventCard from '../../components/home/EventCard';
import FooterContent from '../../components/home/FooterContent';
import '../../components/home/home.css';
import { QueryState } from '../../hooks/queries/query-state';
import { useUserFavoriteEvents } from '../../hooks/queries/useFavorite';

import styles from './FavoritesPage.module.css';

const { Title, Paragraph } = Typography;
const VISIBLE_ROWS = 2;

function getColumnsPerRow(containerWidth: number): number {
  const isMobile = containerWidth < 768;
  const minCardWidth = isMobile ? 160 : 180;
  const gap = isMobile ? 16 : 20;

  return Math.max(1, Math.floor((containerWidth + gap) / (minCardWidth + gap)));
}

export default function FavoritesPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const [columnsPerRow, setColumnsPerRow] = useState(4);
  const favoriteEventsQuery = useUserFavoriteEvents();
  const favoriteEvents = favoriteEventsQuery.data ?? [];
  const initialVisibleCount = columnsPerRow * VISIBLE_ROWS;
  const hasMore = favoriteEvents.length > initialVisibleCount;
  const visibleEvents = showAll
    ? favoriteEvents
    : favoriteEvents.slice(0, initialVisibleCount);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) {
      return;
    }

    const updateColumns = () => {
      setColumnsPerRow(getColumnsPerRow(grid.clientWidth));
    };

    updateColumns();

    const resizeObserver = new ResizeObserver(updateColumns);
    resizeObserver.observe(grid);

    return () => resizeObserver.disconnect();
  }, [favoriteEvents.length]);

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
              <div ref={gridRef} className={styles.grid}>
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

