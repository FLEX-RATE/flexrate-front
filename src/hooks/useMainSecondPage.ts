'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchMainSummary } from '@/queries/fetchers.client';
import { qk } from '@/queries/keys';
import { MainResponse } from '@/types/interest.type';

export function useMainSecondPage() {
  const q = useQuery<MainResponse | null, Error>({
    queryKey: qk.mainSummary,
    queryFn: fetchMainSummary,
    staleTime: 60_000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return { mainData: q.data ?? null, isLoading: q.isLoading };
}
