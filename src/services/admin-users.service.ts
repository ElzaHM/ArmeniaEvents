import axios from 'axios';

import type { AdminUser } from '../components/admin/types';

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
};
