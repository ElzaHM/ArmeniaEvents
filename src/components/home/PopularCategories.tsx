import CategoryCard from './CategoryCard';
import { CATEGORIES } from './mockData';
import styles from './PopularCategories.module.css';

export default function PopularCategories() {
  return (
    <section className={styles.section}>
      <div className="homeSection">
        <div className={styles.header}>
          <h2 className={styles.title}>Popular Categories</h2>
          <a href="/categories" className={styles.viewAll}>
            View all <span className={styles.arrow}>→</span>
          </a>
        </div>
        
        <div className={styles.grid}>
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

