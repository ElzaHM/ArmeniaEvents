import { Typography } from 'antd';
import { Link } from 'react-router-dom';

import type { Category } from './types';
import { CategoryIcon } from './CategoryIcon';

import styles from './CategoryCard.module.css';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/events?q=${encodeURIComponent(category.name)}`}
      className={styles.card}
      aria-label={`Browse ${category.name} events`}
    >
      <div className={styles.iconWrap}>
        <CategoryIcon name={category.icon} categoryName={category.name} className={styles.icon} />
      </div>
      <Typography.Text strong className={styles.name}>
        {category.name}
      </Typography.Text>
      <Typography.Text type="secondary" className={styles.count}>
        {category.eventCount} events
      </Typography.Text>
    </Link>
  );
}
