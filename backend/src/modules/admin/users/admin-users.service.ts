import type { User } from '@supabase/supabase-js';

import { supabaseAdminClient } from '../../../lib/supabase.js';

export type AdminUserDto = {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'user';
  status: 'active' | 'inactive' | 'pending';
  avatarUrl: string;
  joinedAt: string;
  eventsCreated: number;
};

export type AdminUserUpdateInput = {
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'pending';
  avatar_url: string;
};

const DEFAULT_AVATAR = (userId: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userId)}`;

function normalizeRole(role: string | undefined): AdminUserDto['role'] {
  if (role === 'admin' || role === 'super_admin' || role === 'moderator' || role === 'user') {
    return role;
  }

  return 'user';
}

function resolveStatus(user: User): AdminUserDto['status'] {
  const metadataStatus = user.user_metadata?.status;

  if (
    metadataStatus === 'active' ||
    metadataStatus === 'inactive' ||
    metadataStatus === 'pending'
  ) {
    return metadataStatus;
  }

  const confirmed = Boolean(user.email_confirmed_at);
  const banned =
    Boolean(user.banned_until) && new Date(user.banned_until as string) > new Date();

  if (banned) {
    return 'inactive';
  }

  return confirmed ? 'active' : 'pending';
}

function mapAuthUser(user: User): AdminUserDto {
  const fullName = user.user_metadata?.fullName as string | undefined;
  const name = fullName?.trim() || user.email?.split('@')[0] || 'User';
  const avatarUrl =
    (user.user_metadata?.avatarUrl as string | undefined)?.trim() || DEFAULT_AVATAR(user.id);

  return {
    id: user.id,
    name,
    email: user.email ?? '',
    role: normalizeRole(user.user_metadata?.role as string | undefined),
    status: resolveStatus(user),
    avatarUrl,
    joinedAt: user.created_at ? new Date(user.created_at).toISOString().slice(0, 10) : '',
    eventsCreated: 0,
  };
}

function buildStatusUpdate(status: AdminUserUpdateInput['status']) {
  switch (status) {
    case 'active':
      return {
        email_confirm: true,
        ban_duration: 'none',
      };
    case 'inactive':
      return {
        ban_duration: '876000h',
      };
    case 'pending':
      return {
        email_confirm: false,
        ban_duration: 'none',
      };
  }
}

export async function listAdminUsers(): Promise<AdminUserDto[]> {
  const { data, error } = await supabaseAdminClient.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    throw new Error(error.message);
  }

  return (data.users ?? []).map(mapAuthUser).sort((a, b) => b.joinedAt.localeCompare(a.joinedAt));
}

export async function updateAdminUser(
  id: string,
  payload: AdminUserUpdateInput,
): Promise<AdminUserDto> {
  const { data: existingData, error: existingError } =
    await supabaseAdminClient.auth.admin.getUserById(id);

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (!existingData.user) {
    throw new Error('User not found.');
  }

  const existingMetadata = existingData.user.user_metadata ?? {};

  const { data, error } = await supabaseAdminClient.auth.admin.updateUserById(id, {
    email: payload.email,
    ...buildStatusUpdate(payload.status),
    user_metadata: {
      ...existingMetadata,
      fullName: payload.name,
      role: payload.role,
      avatarUrl: payload.avatar_url,
      status: payload.status,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Failed to update user.');
  }

  return mapAuthUser(data.user);
}

export async function deleteAdminUser(id: string): Promise<void> {
  const { data: existingData, error: existingError } =
    await supabaseAdminClient.auth.admin.getUserById(id);

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (!existingData.user) {
    throw new Error('User not found.');
  }

  const { error } = await supabaseAdminClient.auth.admin.deleteUser(id);

  if (error) {
    throw new Error(error.message);
  }
}
