import { createContext } from 'react';

import type { AuthSession, LoginPayload, RegisterPayload } from '../services/auth.service';

export type AuthContextValue = {
  session: AuthSession | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
