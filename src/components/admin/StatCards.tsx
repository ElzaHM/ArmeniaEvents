import {CalendarOutlined, EyeOutlined, FolderOutlined, UserOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

import type {StatMetric} from "./types";

import styles from "./StatCards.module.css";

const ICON_MAP = {
  calendar: CalendarOutlined,
  users: UserOutlined,
  folder: FolderOutlined,
  eye: EyeOutlined,
};

const STAT_ROUTES: Record<string, string> = {
  "total-events": "/admin/events",
  "active-users": "/admin/users",
  categories: "/admin/categories",
  "page-views": "/admin/analytics",
};

function formatValue(value: number): string {
  return value.toLocaleString("en-US");
}

interface StatCardsProps {
  stats: StatMetric[];
}

export default function StatCards({stats}: StatCardsProps) {
  return (
    <div className={styles.grid}>
      {stats.map((stat) => {
        const Icon = ICON_MAP[stat.icon];
        const isPositive = stat.changePercent >= 0;
        const path = STAT_ROUTES[stat.id] ?? "/admin";

        return (
          <Link key={stat.id} to={path} className={styles.card} aria-label={`Open ${stat.label}`}>
            <div className={styles.topRow}>
              <div className={styles.iconWrap}>
                <Icon />
              </div>
              <div className={styles.info}>
                <p className={styles.label}>{stat.label}</p>
                <p className={styles.value}>{formatValue(stat.value)}</p>
              </div>
            </div>
            <div className={`${styles.trend} ${!isPositive ? styles.trendNegative : ""}`}>
              <span>
                {isPositive ? "+" : "-"}
                {Math.abs(stat.changePercent)}%
              </span>{" "}
              from last month
            </div>
          </Link>
        );
      })}
    </div>
  );
}
