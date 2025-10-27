import {
  LoanApplicationRequest,
  LoanApplicationResponse,
  LoanReviewApplicationRequest,
  LoanReviewApplicationResponse,
} from '@/types/loanApplication.type';

import { apiClient } from './client';

export const postLoanReviewApplication = async (body: LoanReviewApplicationRequest) => {
  const { data } = await apiClient.post<LoanReviewApplicationResponse>(
    '/api/loans/loan-review-application',
    body
  );
  return data;
};

export const getLoanReviewApplication = async () => {
  const { data } = await apiClient.get<LoanReviewApplicationResponse>(
    '/api/loans/loan-review-application'
  );
  return data;
};

export const postLoanApplication = async (body: LoanApplicationRequest) => {
  const { data } = await apiClient.post<LoanApplicationResponse>(
    '/api/loans/loan-application',
    body
  );
  return data;
};

export const getLoanApplication = async () => {
  const { data } = await apiClient.get<LoanApplicationResponse>(
    '/api/loans/loan-application-result'
  );
  return data;
};
