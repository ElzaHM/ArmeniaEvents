import {NavLink} from "react-router-dom";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CalendarOutlined,
  SettingOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {ADMIN_PROFILE} from "./mockData";

import styles from "./AdminSidebar.module.css";

const NAV_ITEMS = [
  {to: "/admin", label: "Dashboard", icon: AppstoreOutlined, end: true},
  {to: "/admin/events", label: "Events", icon: CalendarOutlined, end: false},
  {to: "/admin/categories", label: "Categories", icon: TagsOutlined, end: false},
  {to: "/admin/users", label: "Users", icon: UserOutlined, end: false},
  {to: "/admin/analytics", label: "Analytics", icon: BarChartOutlined, end: false},
  {to: "/admin/settings", label: "Settings", icon: SettingOutlined, end: false},
];

interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({collapsed, mobileOpen, onMobileClose}: AdminSidebarProps) {
  return (
    <>
      {mobileOpen && <button type="button" className={styles.overlay} onClick={onMobileClose} />}
      <aside
        className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""} ${mobileOpen ? styles.mobileOpen : ""}`}>
        <NavLink to="/admin" className={styles.brand} onClick={onMobileClose}>
          <span className={styles.brandIcon}>📍</span>
          {!collapsed && (
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>Armenia Events</span>
              <span className={styles.brandSubtitle}>Admin Panel</span>
            </div>
          )}
        </NavLink>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {NAV_ITEMS.map(({to, label, icon: Icon, end}) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({isActive}) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
                  }
                  onClick={onMobileClose}>
                  <Icon className={styles.navIcon} />
                  {!collapsed && <span>{label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.profile}>
          <div className={styles.profileCard}>
            <img src={ADMIN_PROFILE.avatarUrl} alt={ADMIN_PROFILE.name} className={styles.avatar} />
            {!collapsed && (
              <div className={styles.profileInfo}>
                <div className={styles.profileName}>{ADMIN_PROFILE.name}</div>
                <div className={styles.profileRole}>{ADMIN_PROFILE.role}</div>
              </div>
            )}
          </div>
        </div>

        {!collapsed && <div className={styles.copyright}>© 2024 Armenia Events</div>}
      </aside>
    </>
  );
}
