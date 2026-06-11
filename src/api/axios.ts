import axios from 'axios';

// Scoped to our backend only (`VITE_API_URL/api`). Gemini and other third-party SDKs
// use native fetch directly and are not affected by this interceptor.
const apiOrigin = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export const api = axios.create({
  baseURL: apiOrigin ? `${apiOrigin}/api` : '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('armenia-events-access-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
