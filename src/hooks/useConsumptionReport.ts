import { useQuery } from '@tanstack/react-query';

import {
  getConsumptionReport,
  getConsumptionStaticstic,
  getReportAvailableMonth,
} from '@/apis/consumption';
import {
  GetConsumptionReportResponse,
  GetConsumptionStaticsticResponse,
} from '@/types/consumption.type';

export const useConsumptionReport = (month?: string, enabled: boolean = !!month) => {
  return useQuery<GetConsumptionReportResponse[]>({
    queryKey: ['consumption-reports', month],
    queryFn: async () => {
      if (!month) return [];
      return getConsumptionReport(month);
    },
    enabled,
    staleTime: 60_000,
  });
};

export const useAvailableConsumptionMonth = () => {
  return useQuery<string[]>({
    queryKey: ['consumption-report-month'],
    queryFn: () => getReportAvailableMonth(),
    staleTime: 60_000,
  });
};

export const useConsumptionStatistic = (month?: string, enabled: boolean = !!month) => {
  return useQuery<GetConsumptionStaticsticResponse>({
    queryKey: ['consumption-statistic', month],
    queryFn: async () => {
      if (!month) throw new Error('해당 월 소비 데이터가 존재하지 않습니다.');
      return getConsumptionStaticstic(month);
    },
    enabled,
    staleTime: 60_000,
  });
};
