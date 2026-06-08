import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { DEFAULT_ADMIN_DISPLAY, getAdminDisplayName } from '../../../components/admin/adminDefaults';
import { useAuth } from '../../../hooks/useAuth';
import { queryClient } from '../../../providers/query-client';
import { supabase } from '../../../lib/supabase';
import {
  adminProfileDisplayQueryKey,
  adminProfileQueryOptions,
  type AdminProfileDisplay,
} from './profileApi';

export type { AdminProfileDisplay };

function readMetadataString(metadata: Record<string, unknown>, key: string): string {
  const value = metadata[key];
  return typeof value === 'string' ? value.trim() : '';
}

function buildDefaultDisplay(fallbackFullName?: string): AdminProfileDisplay {
  return {
    displayName: getAdminDisplayName(fallbackFullName),
    avatarUrl: DEFAULT_ADMIN_DISPLAY.avatarUrl,
    roleLabel: DEFAULT_ADMIN_DISPLAY.role,
  };
}

function getCachedProfileDisplay(
  accessToken: string | undefined,
): AdminProfileDisplay | undefined {
  if (!accessToken) {
    return undefined;
  }

  return queryClient.getQueryData<AdminProfileDisplay>([
    ...adminProfileDisplayQueryKey,
    accessToken,
  ]);
}

export async function resolveProfileDisplay(
  accessToken: string | undefined,
  fallbackFullName?: string,
): Promise<AdminProfileDisplay> {
  if (!accessToken) {
    return buildDefaultDisplay(fallbackFullName);
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const sessionUser = sessionData.session?.user;

  if (sessionUser) {
    const metadata = sessionUser.user_metadata ?? {};
    const fullName =
      readMetadataString(metadata, 'fullName') || fallbackFullName || '';

    return {
      displayName: getAdminDisplayName(fullName),
      avatarUrl:
        readMetadataString(metadata, 'avatarUrl') || DEFAULT_ADMIN_DISPLAY.avatarUrl,
      roleLabel:
        readMetadataString(metadata, 'position') || DEFAULT_ADMIN_DISPLAY.role,
    };
  }

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return buildDefaultDisplay(fallbackFullName);
  }

  const metadata = data.user.user_metadata ?? {};
  const fullName = readMetadataString(metadata, 'fullName') || fallbackFullName || '';

  return {
    displayName: getAdminDisplayName(fullName),
    avatarUrl: readMetadataString(metadata, 'avatarUrl') || DEFAULT_ADMIN_DISPLAY.avatarUrl,
    roleLabel: readMetadataString(metadata, 'position') || DEFAULT_ADMIN_DISPLAY.role,
  };
}

export function useAdminProfileDisplay(): AdminProfileDisplay {
  const { session } = useAuth();
  const accessToken = session?.accessToken;
  const fallbackFullName = session?.user.fullName;
  const defaultDisplay = buildDefaultDisplay(fallbackFullName);
  const queryKey = [...adminProfileDisplayQueryKey, accessToken ?? 'anonymous'] as const;
  const cachedDisplay = getCachedProfileDisplay(accessToken);

  const { data } = useQuery({
    queryKey,
    queryFn: () => resolveProfileDisplay(accessToken, fallbackFullName),
    enabled: Boolean(accessToken),
    staleTime: adminProfileQueryOptions.staleTime,
    gcTime: adminProfileQueryOptions.gcTime,
    placeholderData: keepPreviousData,
    initialData: cachedDisplay ?? defaultDisplay,
    initialDataUpdatedAt: cachedDisplay ? Date.now() : undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: cachedDisplay ? false : 'always',
    throwOnError: false,
  });

  return data ?? cachedDisplay ?? defaultDisplay;
}
