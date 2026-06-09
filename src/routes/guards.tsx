import type { ReactElement } from 'react';
import { Spin } from 'antd';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

function getRedirectState(location: ReturnType<typeof useLocation>) {
  return (location.state as { from?: string } | null)?.from;
}

export function RequireAuth({ children }: { children: ReactElement }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" description="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export function RequireGuest({ children }: { children: ReactElement }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  const redirectFrom = getRedirectState(location);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" description="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    if (isAdmin) {
      const adminTarget =
        redirectFrom && redirectFrom.startsWith('/admin') ? redirectFrom : '/admin';
      return <Navigate to={adminTarget} replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export function RequireAdmin({ children }: { children: ReactElement }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" description="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
