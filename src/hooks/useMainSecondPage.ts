import { useQuery } from '@tanstack/react-query';

import { getMain } from '@/apis/interest';
import { queryClient } from '@/lib/queryClient';
import { useUserStore } from '@/stores/userStore';
import { MainResponse } from '@/types/interest.type';

export const useMainSecondPage = () => {
  const token = useUserStore((state) => state.accessToken);

  const { data, isLoading, error } = useQuery<MainResponse>({
    queryKey: ['mainSecondPage'],
    queryFn: () => getMain(token || ''),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    initialData: () => queryClient.getQueryData(['mainSecondPage']),
  });

  return {
    mainData: data,
    isLoading,
    error,
  };
};
