import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

import { loanProductApi } from '@/apis/loanProducts';

export const useSelectLoanProduct = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (productId: number) => loanProductApi.selectLoanProduct(productId),
    retry: false,
    onError: (error: AxiosError) => {
      console.error('대출 신청 에러:', error);

      const status = error?.response?.status;
      if (status === 401) {
        alert('인증이 만료되었어요. 다시 로그인해주세요.');
        router.push('/auth/login');
        return;
      }
      alert(`대출 신청에 실패했습니다.`);
      router.push('/');
    },
  });
};
