import { PeriodKey } from '@/types/chart.type';
import { InterestCurrentResponse, InterestRateResponse, MainResponse } from '@/types/interest.type';

import { apiClient } from './client';

export const getInterestStats = async (periodType: PeriodKey) => {
  const { data } = await apiClient.get<InterestRateResponse>('/loans/interest/stats', {
    params: { periodType },
  });
  return data;
};

export const getInterestCurrent = async () => {
  const { data } = await apiClient.get<InterestCurrentResponse>('/loans/interest/current');
  return data;
};

export const getMain = async () => {
  const { data } = await apiClient.get<MainResponse>('/api/members/main');
  return data;
};
