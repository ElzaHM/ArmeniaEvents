import { QueryState } from '../../hooks/queries/query-state';
import { useEventTabs } from '../../hooks/queries/useEvents';

import styles from './EventTabs.module.css';

export default function EventTabs() {
  const { data: eventTabs, isLoading, isError, error } = useEventTabs();

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error} minHeight={48}>
      {eventTabs && (
        <nav className={styles.tabs} aria-label="Event sections">
          {eventTabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`${styles.tab} ${index === 0 ? styles.tabActive : ''}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      )}
    </QueryState>
  );
}
