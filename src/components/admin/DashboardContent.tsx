import {Spin} from "antd";

import AdminPageHeader from "./AdminPageHeader";
import AnalyticsChart from "./AnalyticsChart";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import StatCards from "./StatCards";
import TopCategoriesChart from "./TopCategoriesChart";
import UpcomingEventsTable from "./UpcomingEventsTable";
import {
  useAdminAnalyticsOverview,
  useAdminCategoryDistribution,
  useAdminDashboardStats,
  useAdminRecentActivity,
  useAdminUpcomingEvents,
} from "../../hooks/queries/useAdminDashboard";

import styles from "./DashboardContent.module.css";

export default function DashboardContent() {
  const {data: stats = [], isLoading: isStatsLoading} = useAdminDashboardStats();
  const {data: upcomingEvents = [], isLoading: isUpcomingLoading} = useAdminUpcomingEvents();
  const {data: analytics, isLoading: isAnalyticsLoading} = useAdminAnalyticsOverview();
  const {data: categoryDistribution = [], isLoading: isCategoriesLoading} =
    useAdminCategoryDistribution();
  const {data: recentActivity = [], isLoading: isActivityLoading} = useAdminRecentActivity();

  const isDashboardLoading =
    isStatsLoading ||
    isUpcomingLoading ||
    isAnalyticsLoading ||
    isCategoriesLoading ||
    isActivityLoading;

  const analyticsSummary =
    analytics?.summary ?? {
      views: {id: "views", label: "Views", value: 0, changePercent: 0, icon: "eye" as const},
      registrations: {
        id: "registrations",
        label: "Registrations",
        value: 0,
        changePercent: 0,
        icon: "users" as const,
      },
      engagementRate: {
        id: "engagement",
        label: "Engagement",
        value: 0,
        changePercent: 0,
        icon: "calendar" as const,
      },
    };

  return (
    <Spin spinning={isDashboardLoading} description="Loading dashboard...">
      <div className={`${styles.dashboard} admin-analytics-report`}>
        <div className="admin-no-print">
          <AdminPageHeader />
        </div>
        <h1 className="admin-print-only">Armenia Events — Analytics Report</h1>
        <p className="admin-print-only">
          Generated {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
        </p>
        <StatCards stats={stats} />

        {!isDashboardLoading ? (
          <>
            <div className={styles.row}>
              <div className={`${styles.upcomingEventsWrapper} admin-no-print`}>
                <UpcomingEventsTable events={upcomingEvents} />
              </div>

              <div className={styles.analyticsWrapper}>
                <AnalyticsChart
                  data={analytics?.chartData ?? []}
                  summary={analyticsSummary}
                />
              </div>
            </div>

            <div className={styles.bottomRow}>
              <div className={`${styles.bottomCard} admin-no-print`}>
                <RecentActivity activities={recentActivity} />
              </div>
              <div className={styles.bottomCard}>
                <TopCategoriesChart categories={categoryDistribution} />
              </div>
              <div className={`${styles.bottomCard} admin-no-print`}>
                <QuickActions />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </Spin>
  );
}
