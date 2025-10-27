import { CreditResponse, CreditStatusResponse } from '@/types/credit.type';

import { apiClient } from './client';

/** 신용 점수 평가 조회 */
export const getCreditScoreEvaluate = async (): Promise<CreditResponse> => {
  const { data } = await apiClient.get<CreditResponse>('/api/credit-score/evaluate');
  return data;
};

/** 신용 점수 조회 */
export const getCreditScore = async (): Promise<CreditResponse> => {
  const { data } = await apiClient.get<CreditResponse>('/api/credit-score');
  return data;
};

/** 신용 점수 등록 여부 조회 */
export const getCreditStatus = async (): Promise<CreditStatusResponse> => {
  const { data } = await apiClient.get<CreditStatusResponse>('/api/members/credit-score-status');
  return data;
};
