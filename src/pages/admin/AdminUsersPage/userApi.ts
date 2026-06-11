import axios from 'axios';

import { api } from '../../../api/axios';
import { supabase } from '../../../lib/supabase';
import type { AdminUser, AdminUserStatus } from '../../../components/admin/types';

const TOKEN_STORAGE_KEY = 'armenia-events-access-token';

const STORAGE_BUCKET =
  import.meta.env.VITE_SUPABASE_EVENT_IMAGES_BUCKET ?? 'EVENT_IMAGES_BUCKET';

export type UserEditRole = 'admin' | 'user';

export type UserEditPayload = {
  name: string;
  email: string;
  role: UserEditRole;
  status: AdminUserStatus;
  avatarUrl: string;
};

type UserUpdateBody = {
  name: string;
  email: string;
  role: UserEditRole;
  status: AdminUserStatus;
  avatar_url: string;
};

function authHeaders() {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function normalizeEditRole(role: AdminUser['role']): UserEditRole {
  return role === 'user' ? 'user' : 'admin';
}

export function formatRoleLabel(role: AdminUser['role']): string {
  return role.replace('_', ' ');
}

export async function uploadUserAvatar(file: File): Promise<string> {
  const extension = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
  const objectPath = `avatars/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(objectPath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'image/jpeg',
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}

function mapApiUserToAdminUser(data: AdminUser, existing: AdminUser): AdminUser {
  return {
    ...existing,
    id: data.id ?? existing.id,
    name: data.name ?? existing.name,
    email: data.email ?? existing.email,
    role: data.role ?? existing.role,
    status: data.status ?? existing.status,
    avatarUrl: data.avatarUrl ?? existing.avatarUrl,
    joinedAt: data.joinedAt ?? existing.joinedAt,
    eventsCreated: data.eventsCreated ?? existing.eventsCreated,
  };
}

export async function updateAdminUser(
  id: string,
  payload: UserEditPayload,
  existing: AdminUser,
): Promise<AdminUser> {
  const body: UserUpdateBody = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    role: payload.role,
    status: payload.status,
    avatar_url: payload.avatarUrl.trim(),
  };

  try {
    const { data } = await api.patch<AdminUser>(`/admin/users/${id}`, body, {
      headers: authHeaders(),
    });

    return mapApiUserToAdminUser(data, existing);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.message;
      throw new Error(message);
    }

    throw error instanceof Error ? error : new Error('Failed to update user');
  }
}

export async function deleteAdminUser(id: string): Promise<void> {
  try {
    await api.delete(`/admin/users/${id}`, {
      headers: authHeaders(),
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.message;
      throw new Error(message);
    }

    throw error instanceof Error ? error : new Error('Failed to delete user');
  }
}
