import type { QueryClient } from '@tanstack/react-query';

import type { AdminCategory, AdminEvent } from '../../../components/admin/types';
import { supabase } from '../../../lib/supabase';

export const adminCategoriesQueryKey = ['admin', 'categories'] as const;

const adminEventsQueryKeyPrefix = ['admin', 'events'] as const;
const adminPendingNotificationsQueryKey = ['admin', 'pending-notifications'] as const;

export async function invalidateAdminCategoryRelatedCaches(
  queryClient: QueryClient,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: adminCategoriesQueryKey }),
    queryClient.invalidateQueries({ queryKey: adminEventsQueryKeyPrefix }),
    queryClient.invalidateQueries({ queryKey: adminPendingNotificationsQueryKey }),
  ]);
}

export type EventCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export function selectActiveEventCategories(
  categories: AdminCategory[],
): EventCategoryOption[] {
  return categories
    .filter((category) => category.isActive)
    .map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }));
}

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

type EventCategoryState = Pick<AdminEvent, 'categoryId' | 'categoryIsActive' | 'status'>;

export function isUncategorizedEvent(
  event: Pick<AdminEvent, 'categoryId' | 'categoryIsActive'>,
): boolean {
  return !event.categoryId || event.categoryIsActive === false;
}

export function eventNeedsReview(event: EventCategoryState): boolean {
  return (
    event.status === 'draft' ||
    !event.categoryId ||
    event.categoryIsActive === false
  );
}
