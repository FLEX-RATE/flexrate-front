import { getMain } from '@/apis/interest';
import { queryClient } from '@/lib/queryClient';

export const prefetchMainData = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') ?? '' : '';
  if (!token) return;

  try {
    await queryClient.prefetchQuery({
      queryKey: ['mainSecondPage'],
      queryFn: () => getMain(token),
      staleTime: 1000 * 60 * 5,
    });
  } catch (e) {
    console.warn('prefetchMainData error:', e);
  }
};
