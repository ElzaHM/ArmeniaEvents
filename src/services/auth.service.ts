import axios from 'axios';

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: string | null;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type ResetPasswordPayload = {
  accessToken: string;
  password: string;
  confirmPassword: string;
};

const api = axios.create({
  baseURL: '/api',
});

export const TOKEN_STORAGE_KEY = 'armenia-events-access-token';
export const REFRESH_TOKEN_STORAGE_KEY = 'armenia-events-refresh-token';

const ME_CACHE_TTL_MS = 5 * 60 * 1000;

type MeCacheEntry = {
  token: string;
  session: AuthSession;
  expiresAt: number;
};

let meCache: MeCacheEntry | null = null;
let inflightMeRequest: { token: string; promise: Promise<AuthSession> } | null = null;

function clearMeCache(): void {
  meCache = null;
}

export function persistAuthTokens(session: AuthSession): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, session.accessToken);

  if (session.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, session.refreshToken);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }
}

export function clearAuthTokens(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function updateCachedAuthUser(
  accessToken: string,
  patch: Partial<Pick<AuthUser, 'fullName'>>,
): AuthSession | null {
  if (!meCache || meCache.token !== accessToken) {
    return null;
  }

  const nextSession: AuthSession = {
    ...meCache.session,
    user: {
      ...meCache.session.user,
      ...patch,
    },
  };

  cacheMeSession(accessToken, nextSession);
  return nextSession;
}

function cacheMeSession(token: string, session: AuthSession): void {
  meCache = {
    token,
    session,
    expiresAt: Date.now() + ME_CACHE_TTL_MS,
  };
}

function getCachedMeSession(token: string): AuthSession | null {
  if (!meCache || meCache.token !== token || meCache.expiresAt <= Date.now()) {
    return null;
  }

  return meCache.session;
}

function toApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      'Request failed';
    return new Error(message);
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error('Unexpected error');
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthSession> {
    try {
      const { data } = await api.post<AuthSession>('/auth/register', payload);
      cacheMeSession(data.accessToken, data);
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async login(payload: LoginPayload): Promise<AuthSession> {
    try {
      const { data } = await api.post<AuthSession>('/auth/login', payload);
      cacheMeSession(data.accessToken, data);
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async me(token: string): Promise<AuthSession> {
    const normalizedToken = token.trim();

    if (!normalizedToken) {
      throw new Error('Missing access token');
    }

    const cachedSession = getCachedMeSession(normalizedToken);
    if (cachedSession) {
      return cachedSession;
    }

    if (inflightMeRequest?.token === normalizedToken) {
      return inflightMeRequest.promise;
    }

    const promise = (async () => {
      try {
        const { data } = await api.get<AuthSession>('/auth/me', {
          headers: {
            Authorization: `Bearer ${normalizedToken}`,
          },
        });
        cacheMeSession(normalizedToken, data);
        return data;
      } catch (error) {
        if (meCache?.token === normalizedToken) {
          clearMeCache();
        }
        throw toApiError(error);
      } finally {
        if (inflightMeRequest?.token === normalizedToken) {
          inflightMeRequest = null;
        }
      }
    })();

    inflightMeRequest = { token: normalizedToken, promise };
    return promise;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      clearMeCache();
      clearAuthTokens();
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      throw toApiError(error);
    }
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    try {
      await api.post('/auth/reset-password', payload);
    } catch (error) {
      throw toApiError(error);
    }
  },
};
