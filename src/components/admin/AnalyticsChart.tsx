import { Select } from 'antd';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import AdminCard from './AdminCard';
import type { AnalyticsDataPoint, AnalyticsSummary } from './types';

import styles from './AnalyticsChart.module.css';

interface AnalyticsChartProps {
  data: AnalyticsDataPoint[];
  summary: AnalyticsSummary;
}

export default function AnalyticsChart({ data, summary }: AnalyticsChartProps) {
  const summaryItems = [
    summary.views,
    summary.registrations,
    summary.engagementRate,
  ];

  return (
    <AdminCard
      title="Analytics Overview"
      extra={
        <Select
          defaultValue="month"
          size="small"
          classNames={{ popup: { root: 'admin-select-dropdown' } }}
          options={[
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
            { value: 'year', label: 'This Year' },
          ]}
        />
      }
    >
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={250} minHeight={250}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--admin-gold)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--admin-gold)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-chart-grid)" />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--admin-text-muted)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--admin-text-muted)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--admin-surface-solid)',
                border: '1px solid var(--admin-border)',
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
              {item.id === 'engagement' ? `${item.value}%` : item.value.toLocaleString()}
            </span>
            <span className={styles.summaryTrend}>+{item.changePercent}%</span>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}
