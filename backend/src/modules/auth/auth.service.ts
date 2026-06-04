import type { User } from '@supabase/supabase-js';

import type { LoginInput, RegisterInput } from './auth.schema.js';
import { supabaseAuthClient } from '../../lib/supabase.js';

export type AuthPayload = {
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresAt: string | null;
};

function mapUser(user: User) {
  return {
    id: user.id,
    email: user.email ?? '',
    fullName: (user.user_metadata?.fullName as string | undefined) ?? '',
  };
}

function mapAuthResponse(data: {
  user: User;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at?: number;
  };
}): AuthPayload {
  return {
    user: mapUser(data.user),
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : null,
  };
}

export async function register(input: RegisterInput): Promise<AuthPayload> {
  const { data, error } = await supabaseAuthClient.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        fullName: input.fullName,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user || !data.session) {
    throw new Error('Registration succeeded but session was not created.');
  }

  return mapAuthResponse({
    user: data.user,
    session: data.session,
  });
}

export async function login(input: LoginInput): Promise<AuthPayload> {
  const { data, error } = await supabaseAuthClient.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user || !data.session) {
    throw new Error('Login failed: missing user session.');
  }

  return mapAuthResponse({
    user: data.user,
    session: data.session,
  });
}

export async function getUserFromToken(token: string) {
  const { data, error } = await supabaseAuthClient.auth.getUser(token);
  if (error || !data.user) {
    return null;
  }

  return mapUser(data.user);
}
