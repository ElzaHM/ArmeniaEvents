import { Badge, Button, Input } from 'antd';
import {
  BellOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SearchOutlined,
  SunOutlined,
} from '@ant-design/icons';

import { useTheme } from '../../hooks/useTheme';
import { ADMIN_PROFILE } from './mockData';

import styles from './AdminHeader.module.css';

interface AdminHeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileMenu: () => void;
}

export default function AdminHeader({
  sidebarCollapsed,
  onToggleSidebar,
  onOpenMobileMenu,
}: AdminHeaderProps) {
  const { mode, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <Button
        type="text"
        className={styles.menuBtn}
        icon={<MenuOutlined />}
        onClick={onOpenMobileMenu}
        aria-label="Open menu"
      />
      <Button
        type="text"
        icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        className="admin-desktop-only"
      />

      <div className={styles.searchWrap}>
        <Input
          prefix={<SearchOutlined style={{ color: 'var(--admin-text-muted)' }} />}
          placeholder="Search events, users..."
          suffix={
            <span style={{ color: 'var(--admin-text-muted)', fontSize: 12 }}>⌘ K</span>
          }
          size="large"
          style={{
            background: 'var(--admin-surface-solid)',
            borderColor: 'var(--admin-border)',
          }}
        />
      </div>

      <div className={styles.actions}>
        <Button
          type="text"
          icon={mode === 'light' ? <MoonOutlined /> : <SunOutlined />}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        />
        <Badge count={2} size="small" offset={[-2, 2]}>
          <Button
            type="text"
            icon={<BellOutlined />}
            aria-label="Notifications"
          />
        </Badge>
        <div className={styles.userSnippet}>
          <img
            src={ADMIN_PROFILE.avatarUrl}
            alt={ADMIN_PROFILE.name}
            className={styles.userAvatar}
          />
          <span className={styles.userName}>{ADMIN_PROFILE.name}</span>
        </div>
      </div>
    </header>
  );
}
