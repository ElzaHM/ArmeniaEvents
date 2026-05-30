import { EVENT_TABS } from './mockData';

import styles from './EventTabs.module.css';

export default function EventTabs() {
  return (
    <nav className={styles.tabs} aria-label="Event sections">
      {EVENT_TABS.map((tab, index) => (
        <button
          key={tab}
          type="button"
          className={`${styles.tab} ${index === 0 ? styles.tabActive : ''}`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
