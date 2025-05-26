import { useQuery } from '@tanstack/react-query';
import { getCustomerLoanStatus } from '@/apis/customer';
import { useUserStore } from '@/stores/userStore';

export const useLoanStatus = () => {
  const token = localStorage.getItem('accessToken');

  return useQuery({
    queryKey: ['loan-status'],
    queryFn: async () => {
      if (!token) throw new Error('로그인이 필요합니다.');
      return await getCustomerLoanStatus(token);
    },
    enabled: !!token,
    retry: 1,
  });
};
