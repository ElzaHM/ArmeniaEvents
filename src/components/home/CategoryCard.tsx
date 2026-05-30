import { Typography } from 'antd';

import type { Category } from './types';
import { CategoryIcon } from './CategoryIcon';

import styles from './CategoryCard.module.css';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.iconWrap}>
        <CategoryIcon name={category.icon} className={styles.icon} />
      </div>
      <Typography.Text strong className={styles.name}>
        {category.name}
      </Typography.Text>
      <Typography.Text type="secondary" className={styles.count}>
        {category.eventCount} events
      </Typography.Text>
    </article>
  );
}
