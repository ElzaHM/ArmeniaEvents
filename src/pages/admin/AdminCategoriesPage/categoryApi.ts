import { supabase } from '../../../lib/supabase';
import type { AdminCategory } from '../../../components/admin/types';
import type { Database } from '../../../types/database.generated';

type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

type CategoryListRow = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  is_active?: boolean | null;
  events?: { count: number }[];
};

export type CategoryFormPayload = {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
};

function resolveEventCount(row: CategoryListRow): number {
  const aggregatedCount = row.events?.[0]?.count;
  return typeof aggregatedCount === 'number' ? aggregatedCount : 0;
}

export function mapCategoryRowToAdminCategory(row: CategoryListRow): AdminCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    eventCount: resolveEventCount(row),
    description: row.description ?? '',
    isActive: row.is_active ?? true,
  };
}

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*, events(count)')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapCategoryRowToAdminCategory(row as CategoryListRow));
}

export async function createAdminCategory(payload: CategoryFormPayload): Promise<AdminCategory> {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: payload.name.trim(),
      slug: payload.slug.trim(),
      description: payload.description.trim() || null,
      is_active: payload.isActive,
    })
    .select('*, events(count)')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapCategoryRowToAdminCategory(data as CategoryListRow);
}

export async function updateAdminCategory(
  id: string,
  payload: Partial<CategoryFormPayload>,
): Promise<AdminCategory> {
  const updatePayload: CategoryUpdate = {};

  if (payload.name !== undefined) {
    updatePayload.name = payload.name.trim();
  }
  if (payload.slug !== undefined) {
    updatePayload.slug = payload.slug.trim();
  }
  if (payload.description !== undefined) {
    updatePayload.description = payload.description.trim() || null;
  }
  if (payload.isActive !== undefined) {
    updatePayload.is_active = payload.isActive;
  }

  const { data, error } = await supabase
    .from('categories')
    .update(updatePayload)
    .eq('id', id)
    .select('*, events(count)')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapCategoryRowToAdminCategory(data as CategoryListRow);
}

export async function deleteAdminCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}
