import { Typography } from 'antd';

import EventSearchBar from './EventSearchBar';

import styles from './EventSearch.module.css';

export default function EventSearch() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <div className={`eventsSection ${styles.content}`}>
          <Typography.Title level={1} className={styles.title}>
            Search Events
          </Typography.Title>
          <Typography.Paragraph className={styles.subtitle}>
            Find the perfect events in Armenia
          </Typography.Paragraph>
          <EventSearchBar />
        </div>
      </div>
    </section>
  );
}
