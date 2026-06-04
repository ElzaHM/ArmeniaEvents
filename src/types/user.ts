/**
 * User domain model.
 * Unifies admin user types; extensible for public auth/profile later.
 */

/** Formerly `AdminUserRole` in components/admin/types.ts */
export type UserRole = 'super_admin' | 'admin' | 'moderator' | 'user' | 'organizer';

/** Formerly `AdminUserStatus` in components/admin/types.ts */
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl: string;
  joinedAt: string;
  eventsCreated: number;
}

/** Subset used in auth session / header profile. */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
}

/** Formerly `AdminUser` in components/admin/types.ts */
export type AdminUser = User;

export interface AuthSession {
  user: UserProfile;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}
