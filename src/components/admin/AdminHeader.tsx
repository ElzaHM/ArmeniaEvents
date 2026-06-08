import {useEffect, useState} from "react";
import {Button, Dropdown, Input} from "antd";
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
import {useLocation, useNavigate} from "react-router-dom";

import {useTheme} from "../../hooks/useTheme";
import {useAuth} from "../../hooks/useAuth";
import {useAdminProfileDisplay} from "../../pages/admin/AdminProfilePage/useAdminProfileDisplay";
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
  const {displayName, avatarUrl} = useAdminProfileDisplay();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCompactSearch, setIsCompactSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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
      className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""} ${isCompactSearch ? styles.headerCompact : ""}`}>
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

          <div className={styles.actionBox}>
            <BellOutlined style={{color: "inherit", fontSize: "18px"}} />
          </div>

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
