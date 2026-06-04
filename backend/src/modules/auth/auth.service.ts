import type { User } from '@supabase/supabase-js';

import type { LoginInput, RegisterInput } from './auth.schema.js';
import { supabaseAdminClient, supabaseAuthClient } from '../../lib/supabase.js';

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

function isEmailNotConfirmedMessage(message: string) {
  return /not confirmed|email_not_confirmed/i.test(message);
}

function isUserAlreadyExistsMessage(message: string) {
  return /already registered|already exists|already been registered|duplicate/i.test(message);
}

async function confirmUserByEmail(email: string) {
  const { data, error } = await supabaseAdminClient.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    throw new Error(error.message);
  }

  const user = data.users.find((entry) => entry.email?.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('User not found.');
  }

  const { error: confirmError } = await supabaseAdminClient.auth.admin.updateUserById(user.id, {
    email_confirm: true,
  });

  if (confirmError) {
    throw new Error(confirmError.message);
  }
}

async function signInWithCredentials(email: string, password: string): Promise<AuthPayload> {
  const { data, error } = await supabaseAuthClient.auth.signInWithPassword({
    email,
    password,
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

export async function register(input: RegisterInput): Promise<AuthPayload> {
  const { data: created, error: createError } = await supabaseAdminClient.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      fullName: input.fullName,
    },
  });

  if (!createError && created.user) {
    return signInWithCredentials(input.email, input.password);
  }

  if (createError && isUserAlreadyExistsMessage(createError.message)) {
    await confirmUserByEmail(input.email);
    return signInWithCredentials(input.email, input.password);
  }

  // Fallback when admin create is blocked (e.g. rate limits on public signUp path).
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
    if (isUserAlreadyExistsMessage(error.message)) {
      await confirmUserByEmail(input.email);
      return signInWithCredentials(input.email, input.password);
    }
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Registration failed: user was not created.');
  }

  if (data.session) {
    return mapAuthResponse({
      user: data.user,
      session: data.session,
    });
  }

  if (data.user.identities?.length === 0) {
    await confirmUserByEmail(input.email);
    return signInWithCredentials(input.email, input.password);
  }

  const { error: confirmError } = await supabaseAdminClient.auth.admin.updateUserById(data.user.id, {
    email_confirm: true,
  });

  if (confirmError) {
    throw new Error(confirmError.message);
  }

  return signInWithCredentials(input.email, input.password);
}

export async function login(input: LoginInput): Promise<AuthPayload> {
  try {
    return await signInWithCredentials(input.email, input.password);
  } catch (error) {
    if (!(error instanceof Error) || !isEmailNotConfirmedMessage(error.message)) {
      throw error;
    }

    await confirmUserByEmail(input.email);
    return signInWithCredentials(input.email, input.password);
  }
}

export async function getUserFromToken(token: string) {
  const { data, error } = await supabaseAuthClient.auth.getUser(token);
  if (error || !data.user) {
    return null;
  }

  return mapUser(data.user);
}
