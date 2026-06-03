import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export function RequireAuth({ children }: { children: ReactElement }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export function RequireGuest({ children }: { children: ReactElement }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
