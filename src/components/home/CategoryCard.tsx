import { Link } from 'react-router-dom';

import type { Category } from './types';

import styles from './CategoryCard.module.css';

interface CategoryCardProps {
  category: Category;
}

function formatEventCount(count: number): string {
  return `${count}-${count === 1 ? 'event' : 'events'}`;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/events?category=${encodeURIComponent(category.name)}`}
      className={`${styles.card} glassBlur`}
      aria-label={`Browse ${category.name} events (${formatEventCount(category.eventCount)})`}
    >
      <span className={styles.name}>{category.name}</span>
      <span className={styles.eventCount}>{formatEventCount(category.eventCount)}</span>
    </Link>
  );
}
