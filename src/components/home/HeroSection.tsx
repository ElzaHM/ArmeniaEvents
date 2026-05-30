import { Tag, Typography } from 'antd';

import SearchBar from './SearchBar';
import { POPULAR_TAGS } from './mockData';

import styles from './HeroSection.module.css';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1920&q=80';

export default function HeroSection() {
  return (
    <section className={styles.hero} style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
      <div className={styles.overlay}>
        <div className={`homeSection ${styles.content}`}>
          <Typography.Title level={1} className={styles.title}>
            Discover Events in <span className={styles.highlight}>Armenia</span>
          </Typography.Title>
          <Typography.Paragraph className={styles.subtitle}>
            Find the best events, conferences, meetups, concerts and more around you.
          </Typography.Paragraph>

          <SearchBar />

          <div className={styles.tags}>
            {POPULAR_TAGS.map((tag) => (
              <Tag key={tag} className={styles.tag}>
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
