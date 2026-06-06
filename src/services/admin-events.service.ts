import { supabase } from '../lib/supabase';
import {
  mapApiEventToAdminEvent,
  type ApiEventRow,
} from '../components/admin/mapApiEventToAdminEvent';
import type { AdminEvent } from '../components/admin/types';

export const ADMIN_EVENT_SELECT =
  '*, categories(name), organizers(name, avatar_url)';

export async function fetchAdminEvents(searchQuery?: string): Promise<AdminEvent[]> {
  let query = supabase
    .from('events')
    .select(ADMIN_EVENT_SELECT)
    .order('start_date', { ascending: false, nullsFirst: false });

  if (searchQuery?.trim()) {
    const needle = searchQuery.trim();
    query = query.or(
      `title.ilike.%${needle}%,venue.ilike.%${needle}%,address.ilike.%${needle}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ApiEventRow[]).map(mapApiEventToAdminEvent);
}

export async function fetchUpcomingAdminEvents(limit = 6): Promise<AdminEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select(ADMIN_EVENT_SELECT)
    .not('start_date', 'is', null)
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ApiEventRow[]).map(mapApiEventToAdminEvent);
}
