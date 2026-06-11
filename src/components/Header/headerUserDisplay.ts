function normalizeSeed(fullName?: string, email?: string): string {
  const trimmedName = fullName?.trim();
  if (trimmedName) {
    return trimmedName;
  }

  const trimmedEmail = email?.trim();
  if (!trimmedEmail) {
    return 'User';
  }

  const atIndex = trimmedEmail.indexOf('@');
  return atIndex > 0 ? trimmedEmail.slice(0, atIndex) : trimmedEmail;
}

export function getHeaderUserDisplayName(fullName?: string, email?: string): string {
  const trimmedName = fullName?.trim();
  if (trimmedName) {
    return trimmedName;
  }

  return email?.trim() || 'User';
}

export function getHeaderUserInitials(fullName?: string, email?: string): string {
  const seed = normalizeSeed(fullName, email);
  const normalized = seed.replace(/[._-]+/g, ' ');
  const parts = normalized.split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return '?';
  }

  if (parts.length === 1) {
    return parts[0]!.charAt(0).toUpperCase();
  }

  const first = parts[0]!.charAt(0);
  const last = parts[parts.length - 1]!.charAt(0);
  return `${first}${last}`.toUpperCase();
}

export function getHeaderUserAvatarColor(fullName?: string, email?: string): string {
  const seed = fullName?.trim() || email?.trim() || 'User';
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}
