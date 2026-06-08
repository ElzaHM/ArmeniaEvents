import adminAvatar from '../../assets/adminPage/admin_avatar.png';
import type { AdminSettings } from './types';

/** Fallback display values when auth session data is unavailable. */
export const DEFAULT_ADMIN_DISPLAY = {
  name: 'Admin',
  role: 'Super Administrator',
  avatarUrl: adminAvatar,
};

/** Initial settings form values until a settings API is wired up. */
export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  siteName: 'Armenia Events',
  supportEmail: 'support@armeniaevents.am',
  defaultLanguage: 'en',
  timezone: 'Asia/Yerevan',
  enableNotifications: true,
  enablePublicRegistration: true,
  maintenanceMode: false,
};

export function getAdminDisplayName(fullName?: string | null): string {
  const trimmed = fullName?.trim();
  if (!trimmed) {
    return DEFAULT_ADMIN_DISPLAY.name;
  }

  return trimmed.split(/\s+/)[0] ?? DEFAULT_ADMIN_DISPLAY.name;
}
