import AnalyticsChart from '../../components/admin/AnalyticsChart';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import StatCards from '../../components/admin/StatCards';
import TopCategoriesChart from '../../components/admin/TopCategoriesChart';
import {
  ANALYTICS_CHART_DATA,
  ANALYTICS_SUMMARY,
  CATEGORY_DISTRIBUTION,
  DASHBOARD_STATS,
} from '../../components/admin/mockData';

import styles from './AdminAnalyticsPage.module.css';

export default function AdminAnalyticsPage() {
  return (
    <>
      <AdminPageHeader
        title="Analytics"
        subtitle="Track event performance and audience engagement."
      />
      <StatCards stats={DASHBOARD_STATS.slice(0, 2).concat(DASHBOARD_STATS.slice(3))} />
      <div className={styles.grid}>
        <AnalyticsChart data={ANALYTICS_CHART_DATA} summary={ANALYTICS_SUMMARY} />
        <TopCategoriesChart categories={CATEGORY_DISTRIBUTION} />
      </div>
    </>
  );
}
