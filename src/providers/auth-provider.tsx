import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { AuthSession, LoginPayload, RegisterPayload } from '../services/auth.service';
import { authService } from '../services/auth.service';
import { AuthContext } from './auth-context';

const TOKEN_STORAGE_KEY = 'armenia-events-access-token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  const persistToken = (token: string | null) => {
    if (!token) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return;
    }
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  };

  const bootstrapSession = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const currentSession = await authService.me(token);
      setSession(currentSession);
      persistToken(currentSession.accessToken);
    } catch {
      persistToken(null);
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
    setSession(currentSession);
    persistToken(currentSession.accessToken);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const currentSession = await authService.register(payload);
    setSession(currentSession);
    persistToken(currentSession.accessToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      persistToken(null);
      setSession(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      session,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(session?.accessToken),
    }),
    [session, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
