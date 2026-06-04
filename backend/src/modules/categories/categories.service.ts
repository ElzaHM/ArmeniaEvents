import { supabaseAdminClient } from '../../lib/supabase.js';
import type { CategoryCreateInput, CategoryUpdateInput } from './categories.schema.js';

const CATEGORY_SELECT = '*';

export async function listCategories() {
  const { data, error } = await supabaseAdminClient.from('categories').select(CATEGORY_SELECT);
  if (error) throw new Error(error.message);
  return data ?? [];
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
