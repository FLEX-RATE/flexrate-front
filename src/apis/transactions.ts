import { apiClient } from './client';

export interface TransactionHistory {
  transactionId: number;
  applicationId: number;
  userId: number;
  memberId: number;
  type: string;
  amount: number;
  occurredAt: string;
  status: string;
}

export interface TransactionHistoryResponse {
  transactionHistories: TransactionHistory[];
  paginationInfo: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  };
}

/**
 * 상환 내역 조회
 */
export const fetchTransactionHistory = async (
  memberId: string,
  page: number,
  size: number
): Promise<TransactionHistoryResponse> => {
  try {
    const { data } = await apiClient.get<TransactionHistoryResponse>(
      `/api/admin/loans/members/${memberId}/transactions`,
      { params: { page, size } }
    );

    return data;
  } catch (error) {
    console.error('거래 내역 조회 실패:', error);
    throw new Error('거래 내역 조회 실패');
  }
};
