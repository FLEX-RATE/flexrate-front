import axios from 'axios';

import { useUserStore } from '@/stores/userStore';

import { postAuthToken } from './auth';

// 공통 설정 포함 axios 인스턴스 생성 (baseURL, JSON 헤더)
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return useUserStore.getState().accessToken;
  }
  return null;
};
const setAccessToken = (token: string) => localStorage.setItem('accessToken', token);

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401 && message === '유효하지 않은 리프레시 토큰입니다.') {
      localStorage.removeItem('accessToken');
      window.location.href = '/auth/login';
      return Promise.reject(error);
    }

    if (status === 401 && originalConfig && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const newAccessToken = await postAuthToken();
        setAccessToken(newAccessToken);

        return apiClient.request({
          ...originalConfig,
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            ...(originalConfig.headers || {}),
          },
          data: originalConfig.data,
        });
      } catch (e) {
        localStorage.removeItem('accessToken');
        window.location.href = '/auth/login';
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);
