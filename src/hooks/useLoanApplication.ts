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

export const usePostLoanReviewApplication = (token: string) => {
  return useMutation({
    mutationFn: (body: LoanReviewApplicationRequest) => postLoanReviewApplication(token, body),
  });
};

export const useGetLoanReivewApplication = (token: string) => {
  return useQuery<LoanReviewApplicationResponse>({
    queryKey: ['loan-review-result', [token]],
    queryFn: () => getLoanReviewApplication(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const usePostLoanApplication = (token: string) => {
  const router = useRouter();

  return useMutation<LoanApplicationResponse, Error, LoanApplicationRequest>({
    mutationFn: (data) => postLoanApplication(token, data),

    onSuccess: () => {
      router.push('/loan-result');
    },

    onError: (error) => {
      console.error('대출 신청 실패:', error);
      alert('대출 신청 중 오류가 발생했습니다.');
    },
  });
};

export const useGetLoanApplication = (token: string) => {
  return useQuery<LoanApplicationResponse>({
    queryKey: ['loan-result', [token]],
    queryFn: () => getLoanApplication(token),
    enabled: !!token,
    retry: 1,
  });
};
