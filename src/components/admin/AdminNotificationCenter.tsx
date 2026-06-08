import { Badge, Button, Popover, Spin } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { useAdminNotifications } from '../../hooks/queries/useAdminNotifications';
import type { AdminNotificationItem } from '../../services/admin-notifications.service';

import styles from './AdminNotificationCenter.module.css';

function getNotificationLabel(item: AdminNotificationItem): string {
  if (item.type === 'user') {
    return `New user ${item.name} is pending approval.`;
  }

  return `New AI event ${item.title} is in drafts.`;
}

function getNotificationIcon(item: AdminNotificationItem): string {
  return item.type === 'user' ? '👤' : '📅';
}

export default function AdminNotificationCenter() {
  const navigate = useNavigate();
  const { data: notifications = [], isLoading, isError } = useAdminNotifications();
  const count = notifications.length;

  const handleNotificationClick = (item: AdminNotificationItem) => {
    if (item.type === 'user') {
      navigate(`/admin/users?edit=${encodeURIComponent(item.id)}`);
      return;
    }

    navigate(`/admin/events?edit=${encodeURIComponent(item.id)}`);
  };

  const content = (
    <div className={styles.panel}>
      {isLoading ? (
        <div className={styles.stateWrap}>
          <Spin size="small" />
        </div>
      ) : isError ? (
        <p className={styles.emptyState}>Unable to load notifications right now.</p>
      ) : count === 0 ? (
        <p className={styles.emptyState}>All caught up! No pending actions.</p>
      ) : (
        <ul className={styles.list}>
          {notifications.map((item) => (
            <li key={`${item.type}-${item.id}`}>
              <button
                type="button"
                className={styles.itemButton}
                onClick={() => handleNotificationClick(item)}
              >
                <span className={styles.itemIcon} aria-hidden="true">
                  {getNotificationIcon(item)}
                </span>
                <span className={styles.itemText}>{getNotificationLabel(item)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <Popover
      content={content}
      title="Administrative Alerts"
      trigger="click"
      placement="bottomRight"
      classNames={{ root: styles.popover }}
    >
      <Badge count={count} offset={[-2, 2]} size="small">
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: '18px' }} />}
          className={styles.bellButton}
          aria-label="Open administrative notifications"
        />
      </Badge>
    </Popover>
  );
}
