import { supabase } from '../lib/supabase';
import { adminUsersService } from './admin-users.service';
import type {
  ActivityItem,
  AnalyticsDataPoint,
  AnalyticsSummary,
  CategoryDistribution,
  StatMetric,
} from '../components/admin/types';

const CATEGORY_COLORS = ['#D48806', '#E8B84A', '#B8730A', '#F0C674', '#8C6A2F', '#6B7280'];

type EventViewsRow = {
  views?: number | null;
  start_date?: string | null;
  created_at?: string | null;
};

type EventCategoryRow = {
  id: string;
  categories: { name: string } | null;
};

async function countTableRows(table: string): Promise<number | null> {
  const client = supabase as unknown as {
    from: (name: string) => ReturnType<typeof supabase.from>;
  };
  const { count, error } = await client
    .from(table)
    .select('*', { count: 'exact', head: true });

  if (error) {
    return null;
  }

  return count ?? 0;
}

async function getActiveUsersCount(): Promise<number> {
  const usersCount = await countTableRows('users');
  if (usersCount !== null) {
    return usersCount;
  }

  const profilesCount = await countTableRows('profiles');
  if (profilesCount !== null) {
    return profilesCount;
  }

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
    getActiveUsersCount(),
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
      label: 'Active Users',
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

export async function getCategoryDistribution(): Promise<CategoryDistribution[]> {
  const { data, error } = await supabase
    .from('events')
    .select('id, categories(name)');

  if (error) {
    throw new Error(error.message);
  }

  const counts = new Map<string, number>();

  for (const row of (data ?? []) as EventCategoryRow[]) {
    const name = row.categories?.name ?? 'General';
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  const total = Array.from(counts.values()).reduce((sum, count) => sum + count, 0);

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1])
    .map(([name, count], index) => ({
      id: String(index + 1),
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));
}

export async function getRecentActivityFromEvents(): Promise<ActivityItem[]> {
  const { data, error } = await supabase
    .from('events')
    .select('id, title, created_at')
    .order('created_at', { ascending: false, nullsFirst: false })
    .limit(5);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    type: 'event_created' as const,
    message: 'New event created:',
    highlight: row.title,
    timestamp: row.created_at ?? new Date().toISOString(),
  }));
}

function buildAnalyticsChartData(rows: EventViewsRow[]): AnalyticsDataPoint[] {
  const buckets = new Map<string, { views: number; registrations: number }>();

  for (const row of rows) {
    const sourceDate = row.start_date ?? row.created_at;
    if (!sourceDate) {
      continue;
    }

    const date = new Date(sourceDate);
    if (Number.isNaN(date.getTime())) {
      continue;
    }

    const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const current = buckets.get(key) ?? { views: 0, registrations: 0 };
    current.views += row.views ?? 0;
    buckets.set(key, current);
  }

  return Array.from(buckets.entries())
    .slice(-7)
    .map(([date, values]) => ({
      date,
      views: values.views,
      registrations: values.registrations,
    }));
}

export async function getAnalyticsOverview(): Promise<{
  chartData: AnalyticsDataPoint[];
  summary: AnalyticsSummary;
}> {
  const [eventsRowsResult, totalViews] = await Promise.all([
    supabase.from('events').select('views, start_date, created_at'),
    getTotalEventViews(),
  ]);

  if (eventsRowsResult.error) {
    throw new Error(eventsRowsResult.error.message);
  }

  const rows = (eventsRowsResult.data ?? []) as EventViewsRow[];
  const chartData = buildAnalyticsChartData(rows);
  const latestViews = chartData.at(-1)?.views ?? totalViews;

  return {
    chartData,
    summary: {
      views: {
        id: 'views',
        label: 'Views',
        value: latestViews,
        changePercent: 0,
        icon: 'eye',
      },
      registrations: {
        id: 'registrations',
        label: 'Registrations',
        value: 0,
        changePercent: 0,
        icon: 'users',
      },
      engagementRate: {
        id: 'engagement',
        label: 'Engagement',
        value: rows.length > 0 ? Number((totalViews / rows.length).toFixed(1)) : 0,
        changePercent: 0,
        icon: 'calendar',
      },
    },
  };
}

export async function fetchEventSearchCount(query: string): Promise<number> {
  const { count, error } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .ilike('title', `%${query}%`);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}
