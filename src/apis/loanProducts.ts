import { apiClient } from '@/apis/client';

/**
 * 대출 상품 목록 전체 조회 API
 * @return data
 */
export const getAllProducts = async () => {
  const { data } = await apiClient.get('/api/loans');
  return data;
};

/**
 * 특정 대출 상품을 선택했을 시 LoanApplication 생성 API
 * @param productId 선택한 대출 상품 ID
 */
export const selectLoanProduct = async (productId: number) => {
  const { data } = await apiClient.post(`/api/loans/${productId}/select`);
  return data;
};

export const loanProductApi = {
  getAllProducts,
  selectLoanProduct,
};
