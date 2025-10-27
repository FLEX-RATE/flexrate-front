import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import {
  getLoanApplication,
  getLoanReviewApplication,
  postLoanApplication,
  postLoanReviewApplication,
} from '@/apis/loanApplication';
import {
  LoanApplicationRequest,
  LoanApplicationResponse,
  LoanReviewApplicationRequest,
  LoanReviewApplicationResponse,
} from '@/types/loanApplication.type';

export const usePostLoanReviewApplication = () => {
  return useMutation({
    mutationFn: (body: LoanReviewApplicationRequest) => postLoanReviewApplication(body),
  });
};

export const useGetLoanReivewApplication = () => {
  return useQuery<LoanReviewApplicationResponse>({
    queryKey: ['loan-review-result'],
    queryFn: () => getLoanReviewApplication(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const usePostLoanApplication = () => {
  const router = useRouter();

  return useMutation<LoanApplicationResponse, any, LoanApplicationRequest>({
    mutationFn: (data) => postLoanApplication(data),
    onSuccess: () => {
      router.push('/loan-result');
    },
    onError: (error) => {
      const status = error?.response?.status;
      if (status === 401) {
        alert('인증이 만료되었어요. 다시 로그인해주세요.');
        router.push('/auth/login');
        return;
      }
      console.error('대출 신청 실패:', error);
      alert('대출 신청 중 오류가 발생했습니다.');
    },
  });
};

export const useGetLoanApplication = () => {
  return useQuery<LoanApplicationResponse>({
    queryKey: ['loan-result'],
    queryFn: () => getLoanApplication(),
    retry: 1,
  });
};
