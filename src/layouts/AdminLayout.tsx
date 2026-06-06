import { useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import { Outlet } from 'react-router-dom';

import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';
import { adminLightContentTheme } from '../components/admin/adminLightTheme';
import { useTheme } from '../hooks/useTheme';

import '../components/admin/admin.css';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { mode } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (window.matchMedia('(max-width: 1024px)').matches) {
      setMobileOpen((value) => !value);
      return;
    }
    setSidebarCollapsed((value) => !value);
  };

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <div className={`${styles.layout} admin-panel`} data-theme={mode}>
      <AdminSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div
        className={`${styles.main} ${sidebarCollapsed ? styles.mainCollapsed : ''}`}
      >
        <AdminHeader
          sidebarCollapsed={sidebarCollapsed}
          mobileOpen={mobileOpen}
          onToggleSidebar={handleToggleSidebar}
        />
        <ConfigProvider theme={mode === 'light' ? adminLightContentTheme : undefined}>
          <main className={`${styles.content} admin-content`}>
            <Outlet />
          </main>
        </ConfigProvider>
      </div>
    </div>
  );
}
