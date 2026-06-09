import { flushSync } from 'react-dom';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { isAdminRole } from '../lib/user-roles';
import type { AuthSession, LoginPayload, RegisterPayload } from '../services/auth.service';
import {
  authService,
  clearAuthTokens,
  getStoredAccessToken,
  persistAuthTokens,
  updateCachedAuthUser,
} from '../services/auth.service';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  const bootstrapSession = useCallback(async () => {
    const token = getStoredAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const currentSession = await authService.me(token);
      setSession(currentSession);
      persistAuthTokens(currentSession);
    } catch {
      clearAuthTokens();
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void bootstrapSession();
  }, [bootstrapSession]);

  const login = useCallback(async (payload: LoginPayload) => {
    const currentSession = await authService.login(payload);
    flushSync(() => {
      setSession(currentSession);
      persistAuthTokens(currentSession);
    });
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const currentSession = await authService.register(payload);
    setSession(currentSession);
    persistAuthTokens(currentSession);
  }, []);

  const establishSession = useCallback((currentSession: AuthSession) => {
    flushSync(() => {
      setSession(currentSession);
      persistAuthTokens(currentSession);
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearAuthTokens();
      setSession(null);
    }
  }, []);

  const syncSessionProfile = useCallback((fullName: string) => {
    const accessToken = session?.accessToken ?? getStoredAccessToken();
    if (!accessToken) {
      return;
    }

    const nextSession = updateCachedAuthUser(accessToken, { fullName });
    if (nextSession) {
      setSession(nextSession);
    }
  }, [session?.accessToken]);

  const value = useMemo(
    () => ({
      session,
      loading,
      login,
      register,
      establishSession,
      logout,
      syncSessionProfile,
      isAuthenticated: Boolean(session?.accessToken),
      isAdmin: isAdminRole(session?.user.role),
    }),
    [session, loading, login, register, establishSession, logout, syncSessionProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
