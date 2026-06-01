import { QueryState } from '../../hooks/queries/query-state';
import { useCategories } from '../../hooks/queries/useCategories';
import CategoryCard from './CategoryCard';
import styles from './PopularCategories.module.css';

export default function PopularCategories() {
  const { data: categories, isLoading, isError, error } = useCategories();

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      {categories && (
        <section className={styles.section}>
          <div className="homeSection">
            <div className={styles.header}>
              <h2 className={styles.title}>Popular Categories</h2>
              <a href="/categories" className={styles.viewAll}>
                View all <span className={styles.arrow}>→</span>
              </a>
            </div>

            <div className={styles.grid}>
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>
      )}
    </QueryState>
  );
}
