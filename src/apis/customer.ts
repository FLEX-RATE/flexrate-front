import { LoanStatusType } from '@/types/user.type';

import { apiClient } from './client';

/**
 * 고객 상세 정보 조회 (관리자 전용)
 */
export const getAdminCustomerDetail = async (memberId: string) => {
  try {
    const { data } = await apiClient.get(`/api/admin/members/${memberId}`);
    return data;
  } catch (error) {
    throw new Error('고객 정보 조회 실패');
  }
};

/**
 * 고객 대출 상태 조회
 */
export const getCustomerLoanStatus = async (): Promise<LoanStatusType> => {
  const { data } = await apiClient.get<LoanStatusType>('/api/members/loan-status');
  return data;
};
