import { useCallback, useEffect, useState } from 'react';

import { supabase } from '../../../lib/supabase';
import { DEFAULT_ADMIN_DISPLAY, getAdminDisplayName } from '../../../components/admin/adminDefaults';
import { useAuth } from '../../../hooks/useAuth';
import { PROFILE_UPDATED_EVENT } from './profileApi';

export type AdminProfileDisplay = {
  displayName: string;
  avatarUrl: string;
  roleLabel: string;
};

function readMetadataString(metadata: Record<string, unknown>, key: string): string {
  const value = metadata[key];
  return typeof value === 'string' ? value.trim() : '';
}

async function resolveProfileDisplay(
  accessToken: string | undefined,
  fallbackFullName?: string,
): Promise<AdminProfileDisplay> {
  if (!accessToken) {
    return {
      displayName: DEFAULT_ADMIN_DISPLAY.name,
      avatarUrl: DEFAULT_ADMIN_DISPLAY.avatarUrl,
      roleLabel: DEFAULT_ADMIN_DISPLAY.role,
    };
  }

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    const { data: sessionData } = await supabase.auth.getSession();
    const sessionMetadata = sessionData.session?.user.user_metadata ?? {};
    const fullName =
      readMetadataString(sessionMetadata, 'fullName') || fallbackFullName || '';

    return {
      displayName: getAdminDisplayName(fullName),
      avatarUrl:
        readMetadataString(sessionMetadata, 'avatarUrl') || DEFAULT_ADMIN_DISPLAY.avatarUrl,
      roleLabel:
        readMetadataString(sessionMetadata, 'position') || DEFAULT_ADMIN_DISPLAY.role,
    };
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
  const [display, setDisplay] = useState<AdminProfileDisplay>({
    displayName: getAdminDisplayName(session?.user.fullName),
    avatarUrl: DEFAULT_ADMIN_DISPLAY.avatarUrl,
    roleLabel: DEFAULT_ADMIN_DISPLAY.role,
  });

  const refreshDisplay = useCallback(async () => {
    const nextDisplay = await resolveProfileDisplay(
      session?.accessToken,
      session?.user.fullName,
    );
    setDisplay(nextDisplay);
  }, [session?.accessToken, session?.user.fullName]);

  useEffect(() => {
    void refreshDisplay();
  }, [refreshDisplay]);

  useEffect(() => {
    const handleProfileUpdated = () => {
      void refreshDisplay();
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      void refreshDisplay();
    });

    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);
    };
  }, [refreshDisplay]);

  return display;
}
