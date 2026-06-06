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

  return (
    <Spin spinning={isDashboardLoading}>
      <div className={styles.dashboard}>
        <AdminPageHeader />
        <StatCards stats={stats} />

        <div className={styles.row}>
          <div className={styles.upcomingEventsWrapper}>
            <UpcomingEventsTable events={upcomingEvents} />
          </div>

          <div className={styles.analyticsWrapper}>
            <AnalyticsChart
              data={analytics?.chartData ?? []}
              summary={
                analytics?.summary ?? {
                  views: {id: "views", label: "Views", value: 0, changePercent: 0, icon: "eye"},
                  registrations: {
                    id: "registrations",
                    label: "Registrations",
                    value: 0,
                    changePercent: 0,
                    icon: "users",
                  },
                  engagementRate: {
                    id: "engagement",
                    label: "Engagement",
                    value: 0,
                    changePercent: 0,
                    icon: "calendar",
                  },
                }
              }
            />
          </div>
        </div>

        <div className={styles.bottomRow}>
          <RecentActivity activities={recentActivity} />
          <TopCategoriesChart categories={categoryDistribution} />
          <QuickActions />
        </div>
      </div>
    </Spin>
  );
}
