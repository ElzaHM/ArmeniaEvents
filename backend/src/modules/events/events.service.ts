import { supabaseAdminClient } from '../../lib/supabase.js';
import type { EventCreateInput, EventUpdateInput } from './events.schema.js';

const EVENTS_SELECT = `
  *,
  categories ( name ),
  organizers ( name, avatar_url, description )
`;

export async function listEvents() {
  const { data, error } = await supabaseAdminClient.from('events').select(EVENTS_SELECT);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getEventById(id: string) {
  const { data, error } = await supabaseAdminClient
    .from('events')
    .select(EVENTS_SELECT)
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createEvent(payload: EventCreateInput) {
  const { data, error } = await supabaseAdminClient
    .from('events')
    .insert(payload)
    .select(EVENTS_SELECT)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateEvent(id: string, payload: EventUpdateInput) {
  const { data, error } = await supabaseAdminClient
    .from('events')
    .update(payload)
    .eq('id', id)
    .select(EVENTS_SELECT)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteEvent(id: string) {
  const { error } = await supabaseAdminClient.from('events').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
