import { Typography } from 'antd';
import SearchBar from '../home/SearchBar';
import searchBarStyles from '../home/SearchBar.module.css';
import styles from './EventSearch.module.css';


export default function HomePage() {

  return (
    <section className={styles.hero} >
      <div className={styles.overlay}>
        <div className={`eventsSection ${styles.content}`}>
          <Typography.Title level={1} className={styles.title}>
            Search <span className={styles.highlight}>Events</span>
          </Typography.Title>
          <Typography.Paragraph className={styles.subtitle}>
            Find the perfect events in Armenia
          </Typography.Paragraph>
          <SearchBar className={searchBarStyles.eventsSearchBar} />
        </div>
      </div>
    </section>
  );
}
