import { Empty } from 'antd';
import {
  EditOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  TagsOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

import AdminCard from './AdminCard';
import type { ActivityItem, ActivityType } from './types';

import styles from './RecentActivity.module.css';

const ACTIVITY_ICONS: Record<ActivityType, typeof PlusCircleOutlined> = {
  event_created: PlusCircleOutlined,
  event_updated: EditOutlined,
  user_registered: UserAddOutlined,
  category_added: TagsOutlined,
  settings_updated: SettingOutlined,
};

function formatRelativeTime(timestamp: string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <AdminCard title="Recent Activity">
      {activities.length === 0 ? (
        <Empty description="No recent activity yet." />
      ) : (
        <ul className={styles.list}>
          {activities.map((activity) => {
            const Icon = ACTIVITY_ICONS[activity.type];

            return (
              <li key={activity.id} className={styles.item}>
                <span className={styles.iconWrap}>
                  <Icon />
                </span>
                <div className={styles.content}>
                  <p className={styles.message}>
                    {activity.message}{' '}
                    <span className={styles.highlight}>{activity.highlight}</span>
                  </p>
                  <span className={styles.time}>
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AdminCard>
  );
}
