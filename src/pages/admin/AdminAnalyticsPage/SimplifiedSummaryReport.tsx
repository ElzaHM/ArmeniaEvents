import logo from '../../../assets/logo.png';
import type { CategoryDistribution, StatMetric } from '../../../components/admin/types';

import styles from './SimplifiedSummaryReport.module.css';

type SimplifiedSummaryReportProps = {
  stats: StatMetric[];
  categories: CategoryDistribution[];
};

function getStatValue(stats: StatMetric[], id: string): number {
  return stats.find((stat) => stat.id === id)?.value ?? 0;
}

function getStatLabel(stats: StatMetric[], id: string, fallback: string): string {
  return stats.find((stat) => stat.id === id)?.label ?? fallback;
}

export default function SimplifiedSummaryReport({
  stats,
  categories,
}: SimplifiedSummaryReportProps) {
  const generatedAt = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.summaryReport} aria-hidden="true">
      <header className={styles.header}>
        <img src={logo} alt="" className={styles.logo} />
        <div>
          <h1 className={styles.title}>Armenia Events</h1>
          <p className={styles.subtitle}>Analytics Summary Report</p>
        </div>
      </header>

      <p className={styles.meta}>Generated on {generatedAt}</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Platform Overview</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{getStatLabel(stats, 'total-events', 'Total Events')}</td>
              <td>{getStatValue(stats, 'total-events').toLocaleString('en-US')}</td>
            </tr>
            <tr>
              <td>{getStatLabel(stats, 'active-users', 'All Users')}</td>
              <td>{getStatValue(stats, 'active-users').toLocaleString('en-US')}</td>
            </tr>
            <tr>
              <td>{getStatLabel(stats, 'page-views', 'Page Views')}</td>
              <td>{getStatValue(stats, 'page-views').toLocaleString('en-US')}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Top Categories</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Events</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.count.toLocaleString('en-US')}</td>
                  <td>{category.percentage}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No category data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <footer className={styles.footer}>
        Armenia Events Admin Panel · Confidential internal report
      </footer>
    </div>
  );
}
