import { createContext } from 'react';

import type { AuthSession, LoginPayload, RegisterPayload } from '../services/auth.service';

export type AuthContextValue = {
  session: AuthSession | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  establishSession: (session: AuthSession) => void;
  logout: () => Promise<void>;
  syncSessionProfile: (fullName: string) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
