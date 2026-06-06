import axios from 'axios';

import type { AdminUser } from '../components/admin/types';
import { supabase } from '../lib/supabase';

const api = axios.create({ baseURL: '/api' });
const TOKEN_STORAGE_KEY = 'armenia-events-access-token';

function authHeaders() {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const adminUsersService = {
  async getUsers(): Promise<AdminUser[]> {
    const { data } = await api.get<AdminUser[]>('/admin/users', {
      headers: authHeaders(),
    });
    return data;
  },

  async getUsersCount(): Promise<number> {
    const client = supabase as unknown as {
      from: (name: string) => ReturnType<typeof supabase.from>;
    };

    const { count, error } = await client
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (!error && count !== null) {
      return count;
    }

    const users = await this.getUsers();
    return users.length;
  },
};
