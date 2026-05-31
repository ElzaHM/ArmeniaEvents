import {NavLink} from "react-router-dom";
import {
  AppstoreOutlined,
  CalendarOutlined,
  SettingOutlined,
  TagsOutlined,
  UserOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

import {ADMIN_PROFILE} from "./mockData";
import styles from "./AdminSidebar.module.css";
import skylineImg from "../../assets/adminPage/yerevan-skyline.png";

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

      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
        <NavLink to="/admin" className={styles.brand}>
          <div className={styles.brandIcon}>
            <EnvironmentOutlined />
          </div>
          {!collapsed && (
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>Armenia Events</span>
              <span className={styles.brandSubtitle}>ADMIN PANEL</span>
            </div>
          )}
        </NavLink>

        <div className={styles.scrollArea}>
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
                    title={collapsed ? label : undefined}>
                    <Icon className={styles.navIcon} />
                    <span className={styles.navLabel}>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {!collapsed && (
            <div className={styles.skylineDecoration}>
              <img src={skylineImg} alt="" className={styles.skyline} />
            </div>
          )}
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.profileCard}>
            <img src={ADMIN_PROFILE.avatarUrl} alt="Admin" className={styles.avatar} />
            <div className={styles.profileInfo}>
              <div className={styles.profileName}>{ADMIN_PROFILE.name}</div>
              <div className={styles.profileRole}>Super Administrator</div>
            </div>
          </div>
          {!collapsed && <div className={styles.copyright}>© 2026 Armenia Events</div>}
        </div>
      </aside>
    </>
  );
}
