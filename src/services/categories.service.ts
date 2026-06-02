import { FILTER_CATEGORIES } from '../components/events/mockData';
import type { Category, CategoryIconName } from '../components/home/types';
import { supabase } from '../lib/supabase';

const CATEGORY_ICONS: CategoryIconName[] = [
  'code',
  'briefcase',
  'rocket',
  'music',
  'palette',
  'camera',
  'bulb',
];

type CategoryRow = {
  id: string;
  name: string;
  icon?: string | null;
  event_count?: number | null;
};

function mapIcon(icon: string | null | undefined): CategoryIconName {
  if (icon && CATEGORY_ICONS.includes(icon as CategoryIconName)) {
    return icon as CategoryIconName;
  }
  return 'bulb';
}

async function simulateRequest<T>(data: T): Promise<T> {
  await Promise.resolve();
  return data;
}

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from('categories').select('*');

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map((row: CategoryRow) => ({
      id: String(row.id),
      name: row.name,
      icon: mapIcon(row.icon),
      eventCount: row.event_count ?? 0,
    }));
  },

  getFilterCategories(): Promise<{ name: string; count: number }[]> {
    return simulateRequest([...FILTER_CATEGORIES]);
  },

  async getFooterCategories(): Promise<readonly string[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('name')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map((row) => row.name);
  },
};
