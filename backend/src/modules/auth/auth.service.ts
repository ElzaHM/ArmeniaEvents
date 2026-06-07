import type { User } from '@supabase/supabase-js';
import { OAuth2Client } from 'google-auth-library';

import type {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  GoogleLoginInput,
} from './auth.schema.js';
import { supabaseAdminClient, supabaseAuthClient } from '../../lib/supabase.js';
import { env } from '../../config/env.js';
import { parseUserRole, type UserRole } from '../../lib/user-roles.js';

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
};

export type AuthPayload = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: string | null;
};

function mapUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email ?? '',
    fullName: (user.user_metadata?.fullName as string | undefined) ?? '',
    role: parseUserRole(user.app_metadata),
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
    app_metadata: {
      role: 'user',
    },
  });

  if (!createError && created.user) {
    return signInWithCredentials(input.email, input.password);
  }

  if (createError && isUserAlreadyExistsMessage(createError.message)) {
    await confirmUserByEmail(input.email);
    return signInWithCredentials(input.email, input.password);
  }

  // Never call auth.signUp here — it triggers Supabase confirmation emails when enabled.
  throw new Error(
    createError?.message ??
      'Registration failed. Check SUPABASE_SERVICE_ROLE_KEY in .env and restart pnpm dev:api.',
  );
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

export async function requestPasswordReset(input: ForgotPasswordInput): Promise<void> {
  const { error } = await supabaseAuthClient.auth.resetPasswordForEmail(input.email, {
    redirectTo: `${env.CLIENT_ORIGIN}/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const { data, error } = await supabaseAuthClient.auth.getUser(input.accessToken);

  if (error || !data.user) {
    throw new Error('Invalid or expired reset link. Please request a new password reset.');
  }

  const { error: updateError } = await supabaseAdminClient.auth.admin.updateUserById(data.user.id, {
    password: input.password,
  });

  if (updateError) {
    throw new Error(updateError.message);
  }
}

const googleOAuthClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

async function findUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabaseAdminClient.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.users.find((entry) => entry.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

async function createSessionForEmail(email: string): Promise<AuthPayload> {
  const { data: linkData, error: linkError } = await supabaseAdminClient.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });

  const hashedToken = linkData?.properties?.hashed_token;
  if (linkError || !hashedToken) {
    throw new Error(linkError?.message ?? 'Failed to create user session.');
  }

  const { data, error } = await supabaseAuthClient.auth.verifyOtp({
    token_hash: hashedToken,
    type: 'magiclink',
  });

  if (error || !data.user || !data.session) {
    throw new Error(error?.message ?? 'Failed to verify user session.');
  }

  return mapAuthResponse({
    user: data.user,
    session: data.session,
  });
}

async function findOrCreateGoogleUser(email: string, fullName: string, picture?: string): Promise<User> {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return existingUser;
  }

  const { data: created, error: createError } = await supabaseAdminClient.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      fullName,
      avatar_url: picture,
    },
    app_metadata: {
      role: 'user',
      provider: 'google',
    },
  });

  if (createError || !created.user) {
    throw new Error(createError?.message ?? 'Failed to create Google user.');
  }

  return created.user;
}

export async function loginWithGoogle(input: GoogleLoginInput): Promise<AuthPayload> {
  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: input.credential,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const email = payload?.email;
  if (!email) {
    throw new Error('Google account does not include an email address.');
  }

  if (payload.email_verified === false) {
    throw new Error('Google email address is not verified.');
  }

  await findOrCreateGoogleUser(email, payload.name ?? '', payload.picture);
  return createSessionForEmail(email);
}
