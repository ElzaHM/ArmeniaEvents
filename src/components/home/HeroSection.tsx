import { Typography } from 'antd';
import SearchBar from './SearchBar';
import searchBarStyles from './SearchBar.module.css';

// import { useTheme } from '../../hooks/useTheme';
// import homePageBg from '../../assets/homePageBg.png';
// import homePageBgLight from '../../assets/eventPageLigthBg.png';

import styles from './HeroSection.module.css';

export default function HeroSection() {
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

          <div className={styles.searchAndTags}>
            <SearchBar className={searchBarStyles.heroSearchBar} />
          </div>
        </div>
      </div>
    </section>
  );
}
