import {useState, useEffect} from "react";
import {Badge, Button, Dropdown, Input} from "antd";
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
import {useNavigate} from "react-router-dom";

import {useTheme} from "../../hooks/useTheme";
import {useAuth} from "../../hooks/useAuth";
import {ADMIN_PROFILE} from "./mockData";
import styles from "./AdminHeader.module.css";

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
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    const updateMobile = () => setIsMobile(mediaQuery.matches);
    updateMobile();
    mediaQuery.addEventListener("change", updateMobile);
    return () => mediaQuery.removeEventListener("change", updateMobile);
  }, []);

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

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}>
      <Button
        type="text"
        icon={sidebarIcon}
        onClick={onToggleSidebar}
        className={styles.sidebarToggle}
        aria-label={isMobile ? "Toggle navigation menu" : "Toggle sidebar"}
      />

      <div className={styles.searchWrap}>
        <Input
          prefix={<SearchOutlined className={styles.searchIcon} />}
          placeholder="Search events, users, bookings..."
          suffix={<span className={styles.searchShortcut}>⌘ K</span>}
          size="large"
          className={styles.searchInput}
        />
      </div>

      <div className={styles.actions}>
        <Button
          type="text"
          icon={mode === "light" ? <MoonOutlined /> : <SunOutlined />}
          onClick={toggleTheme}
          className={styles.actionBox}
        />

        <div className={styles.actionBox}>
          <Badge count={3} size="small" offset={[2, -2]}>
            <BellOutlined style={{color: "inherit", fontSize: "18px"}} />
          </Badge>
        </div>

        <Dropdown
          menu={{items: USER_MENU_ITEMS, onClick: handleUserMenuClick}}
          trigger={["click"]}
          placement="bottomRight"
          overlayClassName="admin-user-dropdown">
          <button type="button" className={styles.userSnippet}>
            <img
              src={ADMIN_PROFILE.avatarUrl}
              alt={ADMIN_PROFILE.name}
              className={styles.userAvatar}
            />
            <span className={styles.userName}>{ADMIN_PROFILE.name}</span>
            <DownOutlined className={styles.userArrow} />
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
