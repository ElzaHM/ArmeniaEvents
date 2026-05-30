import CategoryCard from './CategoryCard';
import SectionHeader from './SectionHeader';
import { CATEGORIES } from './mockData';

import styles from './PopularCategories.module.css';

export default function PopularCategories() {
  return (
    <section className={styles.section}>
      <div className="homeSection">
        <SectionHeader title="Popular Categories" />
        <div className={styles.grid}>
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
