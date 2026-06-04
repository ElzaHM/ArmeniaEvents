/**
 * Organizer domain model (Supabase `organizers` table).
 */

/** Raw row from Supabase `organizers`. */
export interface OrganizerRow {
  id: string;
  name: string;
  role?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  event_count?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/** Organizer entity returned by organizersService. */
export interface Organizer {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  email?: string;
  phone?: string;
  website?: string;
  eventCount?: number;
}
