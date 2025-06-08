import { useQuery } from '@tanstack/react-query';

import { getInterestStats } from '@/apis/interest';
import { useUserStore } from '@/stores/userStore';
import { PeriodKey } from '@/types/chart.type';

export const useInterestStats = (periodType: PeriodKey) => {
  const token = useUserStore((state) => state.accessToken);
  return useQuery({
    queryKey: ['interestStats', periodType],
    queryFn: async () => {
      return getInterestStats(token!, periodType);
    },
    enabled: !!periodType,
  });
};
