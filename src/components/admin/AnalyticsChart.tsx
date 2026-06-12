import {useEffect, useState} from "react";
import {Select} from "antd";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

import AdminCard from "./AdminCard";
import type {AnalyticsDataPoint, AnalyticsSummary} from "./types";

import styles from "./AnalyticsChart.module.css";

interface AnalyticsChartProps {
  data: AnalyticsDataPoint[];
  summary: AnalyticsSummary;
}

function useCompactChartLayout(): boolean {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const update = () => setCompact(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return compact;
}

export default function AnalyticsChart({data, summary}: AnalyticsChartProps) {
  const summaryItems = [summary.views, summary.registrations, summary.engagementRate];
  const compactLayout = useCompactChartLayout();
  const chartBottomMargin = compactLayout ? 28 : 20;
  const xAxisTickSize = compactLayout ? 10 : 12;

  return (
    <AdminCard
      title="Analytics Overview"
      extra={
        <Select
          defaultValue="month"
          size="small"
          classNames={{popup: {root: "admin-select-dropdown"}}}
          options={[
            {value: "week", label: "This Week"},
            {value: "month", label: "This Month"},
            {value: "year", label: "This Year"},
          ]}
        />
      }>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={150} debounce={50}>
          <AreaChart
            data={data}
            margin={{top: 8, right: 8, left: -16, bottom: chartBottomMargin}}>
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--admin-gold)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--admin-gold)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-chart-grid)" />
            <XAxis
              dataKey="date"
              interval={compactLayout ? "preserveStartEnd" : undefined}
              tick={{fill: "var(--admin-text-muted)", fontSize: xAxisTickSize}}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{fill: "var(--admin-text-muted)", fontSize: compactLayout ? 10 : 12}}
              axisLine={false}
              tickLine={false}
              width={compactLayout ? 28 : 32}
            />
            <Tooltip
              contentStyle={{
                background: "var(--admin-surface-solid)",
                border: "1px solid var(--admin-border)",
                borderRadius: 8,
              }}
            />
            <Area
              type="monotone"
              dataKey="views"
              name="Views"
              stroke="var(--admin-gold)"
              strokeWidth={2}
              fill="url(#viewsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.summary}>
        {summaryItems.map((item) => (
          <div key={item.id} className={styles.summaryItem}>
            <span className={styles.summaryLabel}>{item.label}</span>
            <span className={styles.summaryValue}>
              {item.id === "engagement" ? `${item.value}%` : item.value.toLocaleString()}
            </span>
            <span className={styles.summaryTrend}>+{item.changePercent}%</span>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}
