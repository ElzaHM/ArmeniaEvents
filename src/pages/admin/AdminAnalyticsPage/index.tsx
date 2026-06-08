import {useState} from "react";
import {Button, Spin} from "antd";
import {ExportOutlined} from "@ant-design/icons";

import AnalyticsChart from "../../../components/admin/AnalyticsChart";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import StatCards from "../../../components/admin/StatCards";
import TopCategoriesChart from "../../../components/admin/TopCategoriesChart";
import {
  useAdminAnalyticsOverview,
  useAdminCategoryDistribution,
  useAdminDashboardStats,
} from "../../../hooks/queries/useAdminDashboard";
import {downloadAnalyticsReportCsv, printAnalyticsReport} from "./analyticsExport";
import ExportReportModal from "./ExportReportModal";
import SimplifiedSummaryReport from "./SimplifiedSummaryReport";

import styles from "./AdminAnalyticsPage.module.css";

export default function AdminAnalyticsPage() {
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const {data: stats = [], isLoading: isStatsLoading} = useAdminDashboardStats();
  const {data: analytics, isLoading: isAnalyticsLoading} = useAdminAnalyticsOverview();
  const {data: categoryDistribution = [], isLoading: isCategoriesLoading} =
    useAdminCategoryDistribution();

  const analyticsStats = stats.filter((stat) =>
    ["total-events", "active-users", "page-views"].includes(stat.id),
  );

  const exportData = {
    stats: analyticsStats,
    categories: categoryDistribution,
  };

  return (
    <Spin spinning={isStatsLoading || isAnalyticsLoading || isCategoriesLoading}>
      <div className={styles.page}>
        <div className={styles.headerRow}>
          <AdminPageHeader
            title="Analytics"
            subtitle="Track event performance and audience engagement."
          />
          <Button
            type="default"
            icon={<ExportOutlined />}
            className={styles.exportButton}
            onClick={() => setExportModalOpen(true)}>
            Export Report
          </Button>
        </div>

        <div className={styles.interactiveReport}>
          <h1 className={styles.printTitle}>Armenia Events — Analytics Report</h1>
          <p className={styles.printMeta}>
            Generated {new Date().toLocaleDateString("en-US", {dateStyle: "long"})}
          </p>

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
        </div>

        <SimplifiedSummaryReport stats={analyticsStats} categories={categoryDistribution} />

        <ExportReportModal
          open={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          onFullPdf={() => printAnalyticsReport("full")}
          onSummaryPdf={() => printAnalyticsReport("summary")}
          onCsv={() => downloadAnalyticsReportCsv(exportData)}
        />
      </div>
    </Spin>
  );
}
