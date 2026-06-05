import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import AdminCard from './AdminCard';
import type { CategoryDistribution } from './types';

import styles from './TopCategoriesChart.module.css';

interface TopCategoriesChartProps {
  categories: CategoryDistribution[];
}

export default function TopCategoriesChart({ categories }: TopCategoriesChartProps) {
  const total = categories.reduce((sum, item) => sum + item.count, 0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeCategory = activeIndex !== null ? categories[activeIndex] : null;

  const handleActivate = (index: number) => {
    setActiveIndex((current) => (current === index ? null : index));
  };

  return (
    <AdminCard title="Top Categories">
      <div className={styles.wrap}>
        <div className={styles.chartArea}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                stroke="none"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={(_, index) => handleActivate(index)}
              >
                {categories.map((entry, index) => (
                  <Cell
                    key={entry.id}
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.centerLabel} aria-live="polite">
            {activeCategory ? (
              <>
                <span className={styles.centerValue}>{activeCategory.count}</span>
                <span className={styles.centerText}>{activeCategory.name}</span>
              </>
            ) : (
              <>
                <span className={styles.centerValue}>{total}</span>
                <span className={styles.centerText}>Total</span>
              </>
            )}
          </div>
        </div>
        <ul className={styles.legend}>
          {categories.map((category, index) => (
            <li
              key={category.id}
              className={`${styles.legendItem} ${activeIndex === index ? styles.legendItemActive : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => handleActivate(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleActivate(index);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <span
                className={styles.dot}
                style={{ backgroundColor: category.color }}
              />
              <span className={styles.legendName}>{category.name}</span>
              <span className={styles.legendStats}>
                {category.percentage}% · {category.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </AdminCard>
  );
}
