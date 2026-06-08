import {useEffect, useState} from "react";
import {Badge, Button, Dropdown, Input, Popover, Spin} from "antd";
import type {MenuProps} from "antd";
import {
  BellOutlined,
  LogoutOutlined,
  MoonOutlined,
  SearchOutlined,
  SettingOutlined,
  SunOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {useQuery} from "@tanstack/react-query";
import {useLocation, useNavigate} from "react-router-dom";

import {useTheme} from "../../hooks/useTheme";
import {useAuth} from "../../hooks/useAuth";
import {useAdminProfileDisplay} from "../../pages/admin/AdminProfilePage/useAdminProfileDisplay";
import {
  fetchAdminNotifications,
  type AdminNotificationItem,
} from "../../services/admin-notifications.service";
import styles from "./AdminHeader.module.css";

export const adminPendingNotificationsKey = ["admin", "pending-notifications"] as const;

function getNotificationLabel(item: AdminNotificationItem): string {
  if (item.type === "user") {
    return `New user ${item.name} is pending approval.`;
  }

  return `New AI event ${item.title} is in drafts.`;
}

function getNotificationIcon(item: AdminNotificationItem): string {
  return item.type === "user" ? "👤" : "📅";
}

interface AdminHeaderProps {
  sidebarCollapsed: boolean;
  mobileOpen: boolean;
  onToggleSidebar: () => void;
}

const USER_MENU_ITEMS: MenuProps["items"] = [
  {key: "profile", label: "My Profile", icon: <UserOutlined />},
  {key: "settings", label: "Settings", icon: <SettingOutlined />},
  {type: "divider"},
  {key: "logout", label: "Log Out", icon: <LogoutOutlined />, danger: true},
];

export default function AdminHeader({
  sidebarCollapsed,
  mobileOpen,
  onToggleSidebar,
}: AdminHeaderProps) {
  const {mode, toggleTheme} = useTheme();
  const {logout} = useAuth();
  const {displayName, avatarUrl} = useAdminProfileDisplay();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCompactSearch, setIsCompactSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const {
    data: notifications = [],
    isLoading: notificationsLoading,
    isError: notificationsError,
  } = useQuery({
    queryKey: adminPendingNotificationsKey,
    queryFn: fetchAdminNotifications,
    staleTime: 30_000,
  });
  const notificationCount = notifications.length;

  const handleNotificationClick = (item: AdminNotificationItem) => {
    if (item.type === "user") {
      navigate(`/admin/users?edit=${encodeURIComponent(item.id)}`);
      return;
    }

    navigate(`/admin/events?edit=${encodeURIComponent(item.id)}`);
  };

  const notificationContent = (
    <div className={styles.notificationPanel}>
      {notificationsLoading ? (
        <div className={styles.notificationStateWrap}>
          <Spin size="small" />
        </div>
      ) : notificationsError ? (
        <p className={styles.notificationEmptyState}>Unable to load notifications right now.</p>
      ) : notificationCount === 0 ? (
        <p className={styles.notificationEmptyState}>All caught up! No pending actions.</p>
      ) : (
        <ul className={styles.notificationList}>
          {notifications.map((item) => (
            <li key={`${item.type}-${item.id}`}>
              <button
                type="button"
                className={styles.notificationItemButton}
                onClick={() => handleNotificationClick(item)}>
                <span className={styles.notificationItemIcon} aria-hidden="true">
                  {getNotificationIcon(item)}
                </span>
                <span className={styles.notificationItemText}>{getNotificationLabel(item)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 1024px)");
    const compactSearchQuery = window.matchMedia("(max-width: 499px)");

    const updateMobile = () => setIsMobile(mobileQuery.matches);
    const updateCompactSearch = () => setIsCompactSearch(compactSearchQuery.matches);

    updateMobile();
    updateCompactSearch();
    mobileQuery.addEventListener("change", updateMobile);
    compactSearchQuery.addEventListener("change", updateCompactSearch);

    return () => {
      mobileQuery.removeEventListener("change", updateMobile);
      compactSearchQuery.removeEventListener("change", updateCompactSearch);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchValue(params.get("q") ?? "");
  }, [location.search]);

  const clearSearchParam = () => {
    const params = new URLSearchParams(location.search);
    params.delete("q");
    const nextSearch = params.toString();
    navigate(`${location.pathname}${nextSearch ? `?${nextSearch}` : ""}`);
  };

  const handleSearch = () => {
    const query = searchValue.trim();

    if (!query) {
      clearSearchParam();
      return;
    }

    if (location.pathname === "/admin/events" || location.pathname === "/admin/users") {
      navigate(`${location.pathname}?q=${encodeURIComponent(query)}`);
      return;
    }

    navigate(`/admin/search?q=${encodeURIComponent(query)}`);
  };

  const handleUserMenuClick: MenuProps["onClick"] = async ({key}) => {
    if (key === "profile") {
      navigate("/admin/profile");
      return;
    }

    if (key === "settings") {
      navigate("/admin/settings");
      return;
    }

    if (key === "logout") {
      await logout();
      navigate("/signin", {replace: true});
    }
  };

  const sidebarIcon = isMobile
    ? mobileOpen
      ? <MenuFoldOutlined />
      : <MenuUnfoldOutlined />
    : sidebarCollapsed
      ? <MenuUnfoldOutlined />
      : <MenuFoldOutlined />;

  const searchField = (
    <Input
      prefix={
        <button
          type="button"
          className={styles.searchButton}
          onClick={handleSearch}
          aria-label="Run search">
          <SearchOutlined className={styles.searchIcon} />
        </button>
      }
      placeholder="Search events, users"
      size="large"
      className={styles.searchInput}
      allowClear
      value={searchValue}
      onChange={(event) => {
        const nextValue = event.target.value;
        setSearchValue(nextValue);

        if (!nextValue) {
          clearSearchParam();
        }
      }}
      onClear={clearSearchParam}
      onPressEnter={handleSearch}
    />
  );

  return (
    <header
      className={`admin-no-print ${styles.header} ${isScrolled ? styles.headerScrolled : ""} ${isCompactSearch ? styles.headerCompact : ""}`}>
      <div className={styles.headerMain}>
        <Button
          type="text"
          icon={sidebarIcon}
          onClick={onToggleSidebar}
          className={styles.sidebarToggle}
          aria-label={isMobile ? "Toggle navigation menu" : "Toggle sidebar"}
        />

        {!isCompactSearch ? <div className={styles.searchWrap}>{searchField}</div> : null}

        <div className={styles.actions}>
          <Button
            type="text"
            icon={mode === "light" ? <MoonOutlined /> : <SunOutlined />}
            onClick={toggleTheme}
            className={styles.actionBox}
          />

          <Popover
            content={notificationContent}
            title="Administrative Alerts"
            trigger="click"
            placement="bottomRight"
            classNames={{root: styles.notificationPopover}}>
            <Badge count={notificationCount} offset={[-2, 2]} size="small">
              <Button
                type="text"
                icon={<BellOutlined style={{fontSize: "18px"}} />}
                className={styles.notificationBellButton}
                aria-label="Open administrative notifications"
              />
            </Badge>
          </Popover>

          <Dropdown
            menu={{items: USER_MENU_ITEMS, onClick: handleUserMenuClick}}
            trigger={["click"]}
            placement="bottomRight"
            classNames={{root: "admin-user-dropdown"}}>
            <button type="button" className={styles.userSnippet}>
              <img
                key={avatarUrl}
                src={avatarUrl}
                alt={displayName}
                className={styles.userAvatar}
              />
              <span className={styles.userName}>{displayName}</span>
              <DownOutlined className={styles.userArrow} />
            </button>
          </Dropdown>
        </div>
      </div>

      {isCompactSearch ? (
        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>{searchField}</div>
        </div>
      ) : null}
    </header>
  );
}
