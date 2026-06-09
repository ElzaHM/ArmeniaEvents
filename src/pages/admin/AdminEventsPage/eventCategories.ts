import { supabase } from '../../../lib/supabase';

export type EventCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export async function fetchActiveCategories(): Promise<EventCategoryOption[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active' as any, true)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as EventCategoryOption[];
}

export async function fetchActiveCategoryNames(): Promise<string[]> {
  const categories = await fetchActiveCategories();
  return categories.map((category) => category.name).filter(Boolean);
}

export function toCategorySelectOptions(
  categories: EventCategoryOption[],
  extraNames: string[] = [],
): { value: string; label: string }[] {
  const names = new Set(categories.map((category) => category.name));

  for (const name of extraNames) {
    if (name.trim()) {
      names.add(name.trim());
    }
  }

  return [...names]
    .sort((left, right) => left.localeCompare(right))
    .map((name) => ({ value: name, label: name }));
}

export function toCategoryAutoCompleteOptions(
  categories: EventCategoryOption[],
): { value: string }[] {
  return categories.map((category) => ({ value: category.name }));
}
