import AdminPageHeader from './AdminPageHeader';
import AnalyticsChart from './AnalyticsChart';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import StatCards from './StatCards';
import TopCategoriesChart from './TopCategoriesChart';
import UpcomingEventsTable from './UpcomingEventsTable';
import { getDashboardData } from './mockData';

import styles from './DashboardContent.module.css';

export default function DashboardContent() {
  const data = getDashboardData();

  return (
    <div className={styles.dashboard}>
      <AdminPageHeader />
      <StatCards stats={data.stats} />
      <div className={styles.row}>
        <UpcomingEventsTable events={data.upcomingEvents} />
        <AnalyticsChart data={data.analyticsChart} summary={data.analyticsSummary} />
      </div>
      <div className={styles.bottomRow}>
        <RecentActivity activities={data.recentActivity} />
        <TopCategoriesChart categories={data.categoryDistribution} />
        <QuickActions actions={data.quickActions} />
      </div>
    </div>
  );
}
