import { supabaseAdminClient } from '../../lib/supabase.js';
import type { EventCreateInput, EventUpdateInput } from './events.schema.js';

const EVENTS_SELECT = `
  *,
  event_type,
  language,
  price,
  status,
  views,
  source,
  external_id,
  tags,
  age_range,
  interested_count,
  categories ( name ),
  organizers ( name, avatar_url, description )
`;

type FindAllParams = {
  page?: number;
  pageSize?: number;
  q?: string;
};

type PaginatedEventsResult = {
  data: unknown[];
  total: number;
  page: number;
  pageSize: number;
};

export async function findAll(params: FindAllParams = {}): Promise<PaginatedEventsResult> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabaseAdminClient
    .from('events')
    .select(EVENTS_SELECT, { count: 'exact' })
    .eq('status', 'published');

  if (params.q) {
    query = query.ilike('title', `%${params.q}%`);
  }

  const { data, error, count } = await query.range(start, end);

  if (error) throw new Error(error.message);

  return {
    data: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function findOne(id: string) {
  const { data, error } = await supabaseAdminClient
    .from('events')
    .select(EVENTS_SELECT)
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);

  void supabaseAdminClient
    .from('events')
    .update({ views: (data.views ?? 0) + 1 })
    .eq('id', id);

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
