import {Spin} from "antd";

import AnalyticsChart from "../../../components/admin/AnalyticsChart";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import StatCards from "../../../components/admin/StatCards";
import TopCategoriesChart from "../../../components/admin/TopCategoriesChart";
import {
  useAdminAnalyticsOverview,
  useAdminCategoryDistribution,
  useAdminDashboardStats,
} from "../../../hooks/queries/useAdminDashboard";

import styles from "./AdminAnalyticsPage.module.css";

export default function AdminAnalyticsPage() {
  const {data: stats = [], isLoading: isStatsLoading} = useAdminDashboardStats();
  const {data: analytics, isLoading: isAnalyticsLoading} = useAdminAnalyticsOverview();
  const {data: categoryDistribution = [], isLoading: isCategoriesLoading} =
    useAdminCategoryDistribution();

  const analyticsStats = stats.filter((stat) =>
    ["total-events", "active-users", "page-views"].includes(stat.id),
  );

  return (
    <Spin spinning={isStatsLoading || isAnalyticsLoading || isCategoriesLoading}>
      <AdminPageHeader
        title="Analytics"
        subtitle="Track event performance and audience engagement."
      />
      <StatCards stats={analyticsStats} />
      <div className={styles.grid}>
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
        <TopCategoriesChart categories={categoryDistribution} />
      </div>
    </Spin>
  );
}
