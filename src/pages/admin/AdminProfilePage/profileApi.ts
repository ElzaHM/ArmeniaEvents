import axios from 'axios';

import { api } from '../../../api/axios';
import { supabase } from '../../../lib/supabase';
import { queryClient } from '../../../providers/query-client';
import { DEFAULT_ADMIN_DISPLAY, getAdminDisplayName } from '../../../components/admin/adminDefaults';
import type { AdminUserStatus } from '../../../components/admin/types';
import {
  getStoredRefreshToken,
  TOKEN_STORAGE_KEY,
  updateCachedAuthUser,
} from '../../../services/auth.service';

const STORAGE_BUCKET =
  import.meta.env.VITE_SUPABASE_EVENT_IMAGES_BUCKET ?? 'EVENT_IMAGES_BUCKET';

/** Metadata keys used across auth registration and admin user updates. */
const META = {
  fullName: 'fullName',
  avatarUrl: 'avatarUrl',
  role: 'role',
  status: 'status',
  phone: 'phone',
  position: 'position',
  location: 'location',
} as const;

export type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  location: string;
};

export type ProfileState = ProfileFormValues & {
  userId: string;
  avatarUrl: string;
  role: 'admin' | 'user';
  status: AdminUserStatus;
};

export type AdminProfileDisplay = {
  displayName: string;
  avatarUrl: string;
  roleLabel: string;
};

export const adminProfileDisplayQueryKey = ['admin', 'profile-display'] as const;
export const adminProfileQueryKey = ['admin', 'profile'] as const;

export const adminProfileQueryOptions = {
  staleTime: 5 * 60 * 1000,
  gcTime: 5 * 60 * 1000,
} as const;

export function isIgnorableSupabaseSessionError(message: string): boolean {
  return /session missing|refresh token|auth session missing/i.test(message);
}

function authHeaders() {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function readMetadataString(metadata: Record<string, unknown>, key: string): string {
  const value = metadata[key];
  return typeof value === 'string' ? value.trim() : '';
}

function splitFullName(fullName: string): Pick<ProfileFormValues, 'firstName' | 'lastName'> {
  const trimmed = fullName.trim();

  if (!trimmed) {
    return { firstName: DEFAULT_ADMIN_DISPLAY.name, lastName: '' };
  }

  const spaceIndex = trimmed.indexOf(' ');

  if (spaceIndex === -1) {
    return { firstName: trimmed, lastName: '' };
  }

  return {
    firstName: trimmed.slice(0, spaceIndex),
    lastName: trimmed.slice(spaceIndex + 1).trim(),
  };
}

function resolveStatus(
  metadata: Record<string, unknown>,
  user: { email_confirmed_at?: string | null; banned_until?: string | null },
): AdminUserStatus {
  const metadataStatus = metadata[META.status];

  if (
    metadataStatus === 'active' ||
    metadataStatus === 'inactive' ||
    metadataStatus === 'pending'
  ) {
    return metadataStatus;
  }

  const banned =
    Boolean(user.banned_until) && new Date(user.banned_until as string) > new Date();

  if (banned) {
    return 'inactive';
  }

  return user.email_confirmed_at ? 'active' : 'pending';
}

function resolveRole(metadata: Record<string, unknown>): 'admin' | 'user' {
  return readMetadataString(metadata, META.role) === 'user' ? 'user' : 'admin';
}

function buildFullName(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
}

function mapUserToProfileState(user: {
  id: string;
  email?: string | null;
  email_confirmed_at?: string | null;
  banned_until?: string | null;
  user_metadata?: Record<string, unknown>;
}): ProfileState {
  const metadata = user.user_metadata ?? {};
  const email = user.email ?? '';
  const fullName = readMetadataString(metadata, META.fullName);
  const nameParts = fullName
    ? splitFullName(fullName)
    : { firstName: email.split('@')[0] || DEFAULT_ADMIN_DISPLAY.name, lastName: '' };

  const avatarUrl =
    readMetadataString(metadata, META.avatarUrl) || DEFAULT_ADMIN_DISPLAY.avatarUrl;

  return {
    userId: user.id,
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    email,
    phone: readMetadataString(metadata, META.phone),
    position: readMetadataString(metadata, META.position) || DEFAULT_ADMIN_DISPLAY.role,
    location: readMetadataString(metadata, META.location) || 'Yerevan, Armenia',
    avatarUrl,
    role: resolveRole(metadata),
    status: resolveStatus(metadata, user),
  };
}

export function mapProfileStateToDisplay(profile: ProfileState): AdminProfileDisplay {
  const fullName = buildFullName(profile.firstName, profile.lastName);

  return {
    displayName: getAdminDisplayName(fullName),
    avatarUrl: profile.avatarUrl,
    roleLabel: profile.position || DEFAULT_ADMIN_DISPLAY.role,
  };
}

function buildProfileDisplayQueryKey(accessToken: string): readonly [string, string, string] {
  return [...adminProfileDisplayQueryKey, accessToken];
}

function buildProfileQueryKey(accessToken: string): readonly [string, string, string] {
  return [...adminProfileQueryKey, accessToken];
}

export function updateAdminProfileDisplayCache(
  accessToken: string,
  display: AdminProfileDisplay,
): void {
  queryClient.setQueryData(buildProfileDisplayQueryKey(accessToken), display);
}

export function updateAdminProfileCache(accessToken: string, profile: ProfileState): void {
  queryClient.setQueryData(buildProfileQueryKey(accessToken), profile);
}

export function syncProfileCaches(accessToken: string, profile: ProfileState): void {
  updateAdminProfileCache(accessToken, profile);
  updateAdminProfileDisplayCache(accessToken, mapProfileStateToDisplay(profile));

  const fullName = buildFullName(profile.firstName, profile.lastName);
  updateCachedAuthUser(accessToken, { fullName });
}

function buildProfileFromSave(
  profile: ProfileState,
  values: ProfileFormValues,
  avatarUrl: string,
): ProfileState {
  return {
    ...profile,
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    position: values.position.trim(),
    location: values.location.trim(),
    avatarUrl: avatarUrl.trim(),
  };
}

async function ensureSupabaseSession(accessToken: string): Promise<void> {
  const { data: existingSession } = await supabase.auth.getSession();

  if (existingSession.session?.access_token === accessToken) {
    return;
  }

  const refreshToken = getStoredRefreshToken() ?? '';
  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error && !isIgnorableSupabaseSessionError(error.message)) {
    throw new Error(error.message);
  }
}

async function refreshSupabaseSession(): Promise<void> {
  const { error } = await supabase.auth.refreshSession();

  if (error && !isIgnorableSupabaseSessionError(error.message)) {
    throw new Error(error.message);
  }
}

async function readProfileFromLocalSupabaseSession(): Promise<ProfileState | null> {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session?.user) {
    return null;
  }

  return mapUserToProfileState(sessionData.session.user);
}

async function syncSupabaseProfileMetadata(
  accessToken: string,
  values: ProfileFormValues,
  avatarUrl: string,
): Promise<ProfileState | null> {
  await ensureSupabaseSession(accessToken);

  const fullName = buildFullName(values.firstName, values.lastName);
  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      [META.fullName]: fullName,
      [META.avatarUrl]: avatarUrl.trim(),
      [META.phone]: values.phone.trim(),
      [META.position]: values.position.trim(),
      [META.location]: values.location.trim(),
    },
  });

  if (updateError && !isIgnorableSupabaseSessionError(updateError.message)) {
    throw new Error(updateError.message);
  }

  await refreshSupabaseSession();

  return await readProfileFromLocalSupabaseSession();
}

export async function fetchAdminProfile(accessToken: string): Promise<ProfileState> {
  const localProfile = await readProfileFromLocalSupabaseSession();
  if (localProfile) {
    return localProfile;
  }

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error) {
    if (isIgnorableSupabaseSessionError(error.message)) {
      throw new Error('Failed to load profile.');
    }

    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Failed to load profile.');
  }

  return mapUserToProfileState(data.user);
}

export async function uploadProfileAvatar(file: File): Promise<string> {
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

async function patchProfileViaAdminApi(
  profile: ProfileState,
  values: ProfileFormValues,
  avatarUrl: string,
): Promise<void> {
  const fullName = buildFullName(values.firstName, values.lastName);

  try {
    await api.patch(
      `/admin/users/${profile.userId}`,
      {
        name: fullName,
        email: values.email.trim(),
        role: profile.role,
        status: profile.status,
        avatar_url: avatarUrl.trim(),
        phone: values.phone.trim(),
        position: values.position.trim(),
        location: values.location.trim(),
      },
      { headers: authHeaders() },
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ?? error.message;
      throw new Error(message);
    }

    throw error instanceof Error ? error : new Error('Failed to save profile');
  }
}

export async function saveAdminProfile(
  accessToken: string,
  profile: ProfileState,
  values: ProfileFormValues,
  avatarUrl: string,
): Promise<ProfileState> {
  await patchProfileViaAdminApi(profile, values, avatarUrl);

  const fallbackProfile = buildProfileFromSave(profile, values, avatarUrl);
  let savedProfile: ProfileState = fallbackProfile;

  try {
    const syncedProfile = await syncSupabaseProfileMetadata(accessToken, values, avatarUrl);
    if (syncedProfile) {
      savedProfile = syncedProfile;
    }
  } catch (syncError) {
    const message = syncError instanceof Error ? syncError.message : String(syncError);
    if (!isIgnorableSupabaseSessionError(message)) {
      throw syncError;
    }
  }

  syncProfileCaches(accessToken, savedProfile);
  return savedProfile;
}
