import {useState, useEffect} from "react";
import {Badge, Button, Input} from "antd";
import {
  BellOutlined,
  MoonOutlined,
  SearchOutlined,
  SunOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

import {useTheme} from "../../hooks/useTheme";
import {ADMIN_PROFILE} from "./mockData";
import styles from "./AdminHeader.module.css";

interface AdminHeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileMenu: () => void;
}

export default function AdminHeader({sidebarCollapsed, onToggleSidebar}: AdminHeaderProps) {
  const {mode, toggleTheme} = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}>
      <Button
        type="text"
        icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggleSidebar}
        className={styles.sidebarToggle}
        aria-label="Toggle sidebar"
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
          className={styles.actionBtn}
        />

        <Badge count={3} size="small" offset={[-2, 2]}>
          <Button type="text" icon={<BellOutlined />} className={styles.actionBtn} />
        </Badge>

        <div className={styles.userSnippet}>
          <img
            src={ADMIN_PROFILE.avatarUrl}
            alt={ADMIN_PROFILE.name}
            className={styles.userAvatar}
          />
          <span className={styles.userName}>{ADMIN_PROFILE.name}</span>
          <DownOutlined className={styles.userArrow} />
        </div>
      </div>
    </header>
  );
}
