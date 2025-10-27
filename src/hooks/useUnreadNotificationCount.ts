'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { AxiosError } from 'axios';

import { notificationAPI } from '@/apis/notification';
import { useMe } from '@/hooks/useMe';

interface UseUnreadNotificationCountReturn {
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refreshCount: () => Promise<void>;
}

export const useUnreadNotificationCount = (): UseUnreadNotificationCountReturn => {
  const { data: me } = useMe();
  const isLoggedIn = !!me;

  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      setLoading(true);
      setError(null);
      const res = await notificationAPI.getUnreadCount();
      if (!mountedRef.current) return;
      setUnreadCount(res.unreadCount);
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.status === 401) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        setUnreadCount(0);
        setError('로그인이 필요합니다');
        return;
      }
      setUnreadCount(0);
      setError('안읽은 알림 개수 조회 실패');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [isLoggedIn]);

  const refreshCount = useCallback(async () => {
    await fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      setError(null);
      if (timerRef.current) window.clearInterval(timerRef.current);
      return;
    }
    fetchUnreadCount();
  }, [isLoggedIn, fetchUnreadCount]);

  useEffect(() => {
    if (!isLoggedIn) return;
    timerRef.current = window.setInterval(fetchUnreadCount, 30_000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isLoggedIn, fetchUnreadCount]);

  return { unreadCount, loading, error, refreshCount };
};
