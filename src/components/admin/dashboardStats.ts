import { supabase } from '../../lib/supabase';
import { adminUsersService } from '../../services/admin-users.service';
import type { StatMetric } from './types';

type EventViewsRow = {
  views?: number | null;
};

async function getAllUsersCount(): Promise<number> {
  try {
    const users = await adminUsersService.getUsers();
    return users.length;
  } catch {
    return 0;
  }
}

async function getTotalEventViews(): Promise<number> {
  const { data, error } = await supabase.from('events').select('views');

  if (error) {
    return 0;
  }

  return (data ?? []).reduce((sum, row) => sum + ((row as EventViewsRow).views ?? 0), 0);
}

async function getCategoriesCount(): Promise<number> {
  const { count, error } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });

  if (error) {
    return 0;
  }

  return count ?? 0;
}

export async function getDashboardStats(): Promise<StatMetric[]> {
  const [eventsResult, usersCount, categoriesCount, totalViews] = await Promise.all([
    supabase.from('events').select('*', { count: 'exact', head: true }),
    getAllUsersCount(),
    getCategoriesCount(),
    getTotalEventViews(),
  ]);

  if (eventsResult.error) {
    throw new Error(eventsResult.error.message);
  }

  return [
    {
      id: 'total-events',
      label: 'Total Events',
      value: eventsResult.count ?? 0,
      changePercent: 0,
      icon: 'calendar',
    },
    {
      id: 'active-users',
      label: 'All Users',
      value: usersCount,
      changePercent: 0,
      icon: 'users',
    },
    {
      id: 'categories',
      label: 'Categories',
      value: categoriesCount,
      changePercent: 0,
      icon: 'folder',
    },
    {
      id: 'page-views',
      label: 'Page Views',
      value: totalViews,
      changePercent: 0,
      icon: 'eye',
    },
  ];
}
