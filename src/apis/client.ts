import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/bff',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

type Cfg = AxiosRequestConfig & { _retry?: boolean };
let refreshing: Promise<void> | null = null;

async function refreshCookies() {
  await axios.post('/api/bff/api/auth/token', {}, { withCredentials: true, timeout: 8000 });
}

apiClient.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const status = err.response?.status;
    const cfg = (err.config || {}) as Cfg;

    const url = (cfg.url || '').toLowerCase();
    const isNotification = url.includes('/api/notification') || url.includes('/notification/');

    if (!isNotification && status === 401 && !cfg._retry) {
      cfg._retry = true;
      try {
        refreshing ??= refreshCookies().finally(() => (refreshing = null));
        await refreshing;
        return apiClient.request(cfg);
      } catch {
        if (typeof window !== 'undefined') location.replace('/auth/login');
      }
    }

    if (status === 401 && cfg._retry) {
      if (typeof window !== 'undefined') location.replace('/auth/login');
    }

    return Promise.reject(err);
  }
);
