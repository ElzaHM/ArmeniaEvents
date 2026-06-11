import { FILTER_CATEGORIES } from '../components/events/mockData';
import type { Category } from '../components/home/types';
import { resolveCategoryIconName } from '../components/home/categoryIconUtils';
import { api } from '../api/axios';
import { supabase } from '../lib/supabase';

type CategoryRow = {
  id: string;
  name: string;
  icon?: string | null;
  event_count?: number | null;
  slug?: string | null;
  description?: string | null;
  is_active?: boolean | null;
};

type CategoryCrudPayload = {
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  event_count?: number;
  is_active?: boolean;
};

const TOKEN_STORAGE_KEY = 'armenia-events-access-token';

function authHeaders() {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function mapIcon(name: string, icon: string | null | undefined): Category['icon'] {
  return resolveCategoryIconName(name, icon);
}

async function simulateRequest<T>(data: T): Promise<T> {
  await Promise.resolve();
  return data;
}

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    const { data } = await api.get<CategoryRow[]>('/categories');

    return data.map((row: CategoryRow) => ({
      id: String(row.id),
      name: row.name,
      icon: mapIcon(row.name, row.icon),
      eventCount: row.event_count ?? 0,
    }));
  },

  async createCategory(payload: CategoryCrudPayload): Promise<CategoryRow> {
    const { data } = await api.post<CategoryRow>('/categories', payload, {
      headers: authHeaders(),
    });
    return data;
  },

  async updateCategory(id: string, payload: Partial<CategoryCrudPayload>): Promise<CategoryRow> {
    const { data } = await api.patch<CategoryRow>(`/categories/${id}`, payload, {
      headers: authHeaders(),
    });
    return data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`, {
      headers: authHeaders(),
    });
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

    return (data ?? []).map((row: { name: string }) => row.name);
  },
};
