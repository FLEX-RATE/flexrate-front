import { apiClient } from './client';

/**
 * 상환 내역 조회
 */

export const fetchTransactionHistory = async (
  memberId: string,
  token: string | null,
  page: number,
  size: number
) => {
  try {
    const { data } = await apiClient.get(`/api/admin/loans/members/${memberId}/transactions`, {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    throw new Error('거래 내역 조회 실패');
  }
};
