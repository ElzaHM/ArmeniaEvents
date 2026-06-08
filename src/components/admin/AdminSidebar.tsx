import {NavLink, useNavigate} from "react-router-dom";
import {
  AppstoreOutlined,
  CalendarOutlined,
  LogoutOutlined,
  SearchOutlined,
  TagsOutlined,
  TeamOutlined,
  UserOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
  CloseOutlined, 
} from "@ant-design/icons";
import {Button} from "antd";

import {useAuth} from "../../hooks/useAuth";
import {useAdminProfileDisplay} from "../../pages/admin/AdminProfilePage/useAdminProfileDisplay";
import styles from "./AdminSidebar.module.css";

const NAV_ITEMS = [
  {to: "/admin", label: "Dashboard", icon: AppstoreOutlined, end: true},
  {to: "/admin/events", label: "Events", icon: CalendarOutlined, end: false},
  {to: "/admin/categories", label: "Categories", icon: TagsOutlined, end: false},
  {to: "/admin/users", label: "Users", icon: TeamOutlined, end: false},
  {to: "/admin/search", label: "Search", icon: SearchOutlined, end: false},
  {to: "/admin/analytics", label: "Analytics", icon: BarChartOutlined, end: false},
  {to: "/admin/profile", label: "My Profile", icon: UserOutlined, end: false},
  // {to: "/admin/settings", label: "Settings", icon: SettingOutlined, end: false},
];

interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({collapsed, mobileOpen, onMobileClose}: AdminSidebarProps) {
  const {logout} = useAuth();
  const navigate = useNavigate();
  const {displayName, avatarUrl, roleLabel} = useAdminProfileDisplay();

  const handleLogout = async () => {
    await logout();
    onMobileClose();
    navigate("/signin", {replace: true});
  };

  return (
    <>
      {mobileOpen && <div className={styles.overlay} onClick={onMobileClose} />}

      <aside
        className={`
        admin-no-print
        ${styles.sidebar} 
        ${collapsed ? styles.collapsed : ""} 
        ${mobileOpen ? styles.mobileOpen : ""}
      `}>
        <div className={styles.brand}>
          <NavLink to="/admin" className={styles.brandLink} onClick={onMobileClose}>
            <div className={styles.brandIcon}>
              <EnvironmentOutlined />
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>Armenian Events</span>
              <span className={styles.brandSubtitle}>Admin Panel</span>
            </div>
          </NavLink>

          <Button
            type="text"
            icon={<CloseOutlined />}
            className={styles.closeMobileBtn}
            onClick={onMobileClose}
            aria-label="Close menu"
          />
        </div>
        <div className={styles.sidebarBody}>
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
                    onClick={onMobileClose}
                    title={collapsed ? label : undefined}>
                    <Icon className={styles.navIcon} />
                    <span className={styles.navLabel}>{label}</span>
                  </NavLink>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className={`${styles.navLink} ${styles.navButton} ${styles.logoutLink}`}
                  onClick={handleLogout}
                  title={collapsed ? "Log Out" : undefined}>
                  <LogoutOutlined className={styles.navIcon} />
                  <span className={styles.navLabel}>Log Out</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className={styles.skylineDecoration} aria-hidden="true" />
        <div className={styles.sidebarFooter}>
          <div className={styles.profileCard}>
            <img key={avatarUrl} src={avatarUrl} alt={displayName} className={styles.avatar} />
            <div className={styles.profileInfo}>
              <div className={styles.profileName}>{displayName}</div>
              <div className={styles.profileRole}>{roleLabel}</div>
            </div>
          </div>
          <div className={styles.copyright}>© 2026 Armenia Events</div>
        </div>
      </aside>
    </>
  );
}
