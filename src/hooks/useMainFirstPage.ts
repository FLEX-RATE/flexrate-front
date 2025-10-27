'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchInterestCurrent } from '@/queries/fetchers.client';
import { qk } from '@/queries/keys';
import { InterestCurrentResponse } from '@/types/interest.type';

import { useMe } from './useMe';

export function useMainFirstPage() {
  const interestQ = useQuery<InterestCurrentResponse | null, Error>({
    queryKey: qk.interestCurrent,
    queryFn: fetchInterestCurrent,
    staleTime: 60_000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const meQ = useMe();

  return {
    interestCurrent: interestQ.data ?? null,
    creditScore: { creditScore: meQ.data?.creditScore ?? 0 },
    isLoading: interestQ.isLoading || meQ.isLoading,
  };
}
