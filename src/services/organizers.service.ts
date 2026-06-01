import { supabase } from '../lib/supabase';
import type { Organizer, OrganizerRow } from '../types/organizer';

const DEFAULT_AVATAR_URL =
  'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=200&q=80';

function mapOrganizer(row: OrganizerRow): Organizer {
  return {
    id: String(row.id),
    name: row.name,
    role: row.role ?? 'Event Organizer',
    avatarUrl: row.avatar_url ?? DEFAULT_AVATAR_URL,
    ...(row.email ? { email: row.email } : {}),
    ...(row.phone ? { phone: row.phone } : {}),
    ...(row.website ? { website: row.website } : {}),
    ...(row.event_count != null ? { eventCount: row.event_count } : {}),
  };
}

export const organizersService = {
  async getOrganizers(): Promise<Organizer[]> {
    const { data, error } = await supabase.from('organizers').select('*');

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map((row) => mapOrganizer(row as OrganizerRow));
  },
};
