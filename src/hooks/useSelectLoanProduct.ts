import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

import { loanProductApi } from '@/apis/loanProducts';
import { useUserStore } from '@/stores/userStore';

export const useSelectLoanProduct = () => {
  const router = useRouter();
  const token = useUserStore((state) => state.accessToken);
  return useMutation({
    mutationFn: async (productId: number) => {
      if (!token) {
        throw { response: { status: 401 } };
      }
      return loanProductApi.selectLoanProduct(productId, token);
    },
    onSuccess: () => {},
    onError: (error: AxiosError) => {
      console.error('대출 신청 에러:', error);

      if (error?.response?.status === 401) {
        alert('인증에 실패했습니다. 다시 로그인해주세요.');
        localStorage.removeItem('accessToken');
        router.push('/auth/login');
      } else {
        alert(`대출 신청에 실패했습니다: ${error?.response?.data}`);
        router.push('/');
      }
    },
  });
};
