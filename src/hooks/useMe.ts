'use client';
import { useQuery } from '@tanstack/react-query';

import { fetchMe } from '@/queries/fetchers.client';
import { qk } from '@/queries/keys';
import { Me } from '@/queries/types';

export function useMe() {
  return useQuery<Me | null, Error>({
    queryKey: qk.me,
    queryFn: fetchMe,
    staleTime: 30 * 60 * 1000,
    gcTime: 35 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useMeData(): Me | null | undefined {
  const { data } = useMe();
  return data;
}
