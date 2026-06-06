import type { User } from '@supabase/supabase-js';

import { parseUserRole } from '../../../lib/user-roles.js';
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

function mapAuthUser(user: User): AdminUserDto {
  const fullName = user.user_metadata?.fullName as string | undefined;
  const name = fullName?.trim() || user.email?.split('@')[0] || 'User';
  const confirmed = Boolean(user.email_confirmed_at);
  const banned =
    Boolean(user.banned_until) && new Date(user.banned_until as string) > new Date();

  let status: AdminUserDto['status'] = confirmed ? 'active' : 'pending';
  if (banned) {
    status = 'inactive';
  }

  return {
    id: user.id,
    name,
    email: user.email ?? '',
    role: parseUserRole(user.app_metadata),
    status,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.id)}`,
    joinedAt: user.created_at ? new Date(user.created_at).toISOString().slice(0, 10) : '',
    eventsCreated: 0,
  };
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
