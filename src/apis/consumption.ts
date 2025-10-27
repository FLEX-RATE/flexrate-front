import {
  GetConsumptionReportResponse,
  GetConsumptionStaticsticResponse,
} from '@/types/consumption.type';

import { apiClient } from './client';

export const getConsumptionReport = async (month?: string) => {
  const { data } = await apiClient.get<GetConsumptionReportResponse[]>(
    '/api/reports/consumption-report',
    { params: month ? { month } : undefined }
  );
  return data;
};

export const getReportAvailableMonth = async () => {
  const { data } = await apiClient.get<string[]>('/api/reports/available-months');
  return data;
};

export const getConsumptionStaticstic = async (month?: string) => {
  const { data } = await apiClient.get<GetConsumptionStaticsticResponse>(
    '/api/statistics/consumption-statistic',
    { params: month ? { month } : undefined }
  );
  return data;
};
