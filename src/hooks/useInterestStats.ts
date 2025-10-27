'use client';
import { useQuery } from '@tanstack/react-query';

import { fetchInterestStats } from '@/queries/fetchers.client';
import { qk } from '@/queries/keys';
import type { InterestRateResponse } from '@/types/interest.type';

export function useInterestStats(
  periodType: 'DAILY' | 'WEEKLY' | 'MONTHLY',
  opts?: { enabled?: boolean }
) {
  return useQuery<InterestRateResponse | null, Error>({
    queryKey: [...qk.interestStats, periodType],
    queryFn: () => fetchInterestStats(periodType),
    staleTime: 60000000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: opts?.enabled ?? true,
  });
}
