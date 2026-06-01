import { Tag, Typography } from 'antd';
import { QueryState } from '../../hooks/queries/query-state';
import { usePopularTags } from '../../hooks/queries/useEvents';
import SearchBar from './SearchBar';
// import { useTheme } from '../../hooks/useTheme';
// import homePageBg from '../../assets/homePageBg.png';
// import homePageBgLight from '../../assets/eventPageLigthBg.png';

import styles from './HeroSection.module.css';

export default function HeroSection() {
  const { data: popularTags, isLoading, isError, error } = usePopularTags();
  // const { mode } = useTheme();

  // const bgImage = mode === 'light' ? homePageBgLight : homePageBg;

  return (
    <section
      className={styles.hero}
      // style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className={styles.overlay}>
        <div className={`homeSection ${styles.content}`}>
          <Typography.Title level={1} className={styles.title}>
            Discover <br /> Events in <span className={styles.highlight}>Armenia</span>
          </Typography.Title>
          <Typography.Paragraph className={styles.subtitle}>
            Find the best events, conferences, meetups, concerts and more around you.
          </Typography.Paragraph>

          <SearchBar />

          <QueryState isLoading={isLoading} isError={isError} error={error} minHeight={48}>
            {popularTags && (
              <div className={styles.tags}>
                {popularTags.map((tag) => (
                  <Tag key={tag} className={styles.tag}>
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
          </QueryState>
        </div>
      </div>
    </section>
  );
}
