import { supabaseAdminClient } from '../../lib/supabase.js';
import type { CategoryCreateInput, CategoryUpdateInput } from './categories.schema.js';

const CATEGORY_SELECT = '*';

type CategoryListRow = {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  is_active?: boolean | null;
  event_count?: number | null;
  events?: { count: number }[];
};

function withComputedEventCount(category: CategoryListRow) {
  const { events, ...rest } = category;
  const aggregatedCount = events?.[0]?.count;
  const event_count = typeof aggregatedCount === 'number' ? aggregatedCount : 0;

  return { ...rest, event_count };
}

export async function listCategories() {
  const { data, error } = await supabaseAdminClient
    .from('categories')
    .select(`${CATEGORY_SELECT}, events(count)`)
    .eq('events.status', 'published');

  if (error) throw new Error(error.message);

  return (data ?? []).map((category) => withComputedEventCount(category as CategoryListRow));
}

export async function getCategoryById(id: string) {
  const { data, error } = await supabaseAdminClient
    .from('categories')
    .select(CATEGORY_SELECT)
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createCategory(payload: CategoryCreateInput) {
  const { data, error } = await supabaseAdminClient
    .from('categories')
    .insert(payload)
    .select(CATEGORY_SELECT)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateCategory(id: string, payload: CategoryUpdateInput) {
  const { data, error } = await supabaseAdminClient
    .from('categories')
    .update(payload)
    .eq('id', id)
    .select(CATEGORY_SELECT)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCategory(id: string) {
  const { error } = await supabaseAdminClient.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
