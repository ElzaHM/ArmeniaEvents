import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import AdminCard from './AdminCard';
import type { CategoryDistribution } from './types';

import styles from './TopCategoriesChart.module.css';

interface TopCategoriesChartProps {
  categories: CategoryDistribution[];
}

export default function TopCategoriesChart({ categories }: TopCategoriesChartProps) {
  const total = categories.reduce((sum, item) => sum + item.count, 0);

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
              >
                {categories.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--admin-surface-solid)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.centerLabel}>
            <span className={styles.centerValue}>{total}</span>
            <span className={styles.centerText}>Total</span>
          </div>
        </div>
        <ul className={styles.legend}>
          {categories.map((category) => (
            <li key={category.id} className={styles.legendItem}>
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
