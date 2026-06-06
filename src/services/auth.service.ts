import axios from 'axios';

export type AuthUserRole = 'super_admin' | 'admin' | 'moderator' | 'user';

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: AuthUserRole;
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
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async login(payload: LoginPayload): Promise<AuthSession> {
    try {
      const { data } = await api.post<AuthSession>('/auth/login', payload);
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async me(token: string): Promise<AuthSession> {
    try {
      const { data } = await api.get<AuthSession>('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
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
