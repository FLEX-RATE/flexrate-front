import { useQuery } from '@tanstack/react-query';

import { getCreditScore, getCreditScoreEvaluate, getCreditStatus } from '@/apis/credit';
import { CreditResponse, CreditStatusResponse } from '@/types/credit.type';

export const useCreditScoreEvaluate = (enabled = true) =>
  useQuery<CreditResponse, Error>({
    queryKey: ['credit-score', 'evaluate'],
    queryFn: getCreditScoreEvaluate,
    enabled,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useCreditScore = (enabled = true) =>
  useQuery<CreditResponse, Error>({
    queryKey: ['credit-score'],
    queryFn: getCreditScore,
    enabled,
    retry: 1,
  });

export const useCreditStatus = (enabled = true) =>
  useQuery<CreditStatusResponse, Error>({
    queryKey: ['credit-score-status'],
    queryFn: getCreditStatus,
    enabled,
    retry: 1,
  });
