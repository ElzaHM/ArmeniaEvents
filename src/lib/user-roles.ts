import type { AuthUserRole } from '../services/auth.service';

const ADMIN_ROLES: ReadonlySet<AuthUserRole> = new Set(['super_admin', 'admin', 'moderator']);

export function isAdminRole(role: AuthUserRole | string | undefined): boolean {
  return Boolean(role && ADMIN_ROLES.has(role as AuthUserRole));
}
