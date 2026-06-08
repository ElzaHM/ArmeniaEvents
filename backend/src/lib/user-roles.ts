export type UserRole = 'super_admin' | 'admin' | 'moderator' | 'user';

const ADMIN_ROLES: ReadonlySet<UserRole> = new Set(['super_admin', 'admin', 'moderator']);

export function parseUserRole(appMetadata: Record<string, unknown> | undefined): UserRole {
  const role = appMetadata?.role;
  if (role === 'super_admin' || role === 'admin' || role === 'moderator' || role === 'user') {
    return role;
  }

  return 'user';
}

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.has(role);
}
