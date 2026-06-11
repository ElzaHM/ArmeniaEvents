import { Link } from 'react-router-dom';
import {
  ExportOutlined,
  FolderAddOutlined,
  NotificationOutlined,
  PlusOutlined,
  RightOutlined,
} from '@ant-design/icons';

import AdminCard from './AdminCard';
import type { QuickAction } from './types';

import styles from './QuickActions.module.css';

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: '1',
    title: 'Add New Event',
    description: 'Create and publish a new event.',
    icon: 'plus',
    path: '/admin/events',
  },
  {
    id: '2',
    title: 'Add New Category',
    description: 'Organize events with categories.',
    icon: 'folder-add',
    path: '/admin/categories',
  },
  {
    id: '3',
    title: 'Export Reports',
    description: 'View analytics and download reports.',
    icon: 'export',
    path: '/admin/analytics',
  },
];

const ICON_MAP = {
  plus: PlusOutlined,
  'folder-add': FolderAddOutlined,
  notification: NotificationOutlined,
  export: ExportOutlined,
};

interface QuickActionsProps {
  actions?: QuickAction[];
}

export default function QuickActions({ actions = QUICK_ACTIONS }: QuickActionsProps) {
  return (
    <AdminCard title="Quick Actions">
      <ul className={styles.list}>
        {actions.map((action) => {
          const Icon = ICON_MAP[action.icon];

          return (
            <li key={action.id}>
              <Link to={action.path} className={styles.action}>
                <span className={styles.iconWrap}>
                  <Icon />
                </span>
                <div className={styles.text}>
                  <p className={styles.title}>{action.title}</p>
                  <p className={styles.description}>{action.description}</p>
                </div>
                <RightOutlined className={styles.chevron} />
              </Link>
            </li>
          );
        })}
      </ul>
    </AdminCard>
  );
}
