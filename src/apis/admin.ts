import {
  GetAdminMembersResponse,
  LoanApiResponse,
  LoanDetailsApiResponse,
  PatchLoanStatusPayload,
  PatchMemberPayload,
} from '@/types/admin.type';

import { apiClient } from './client';

/**
 * 관리자 회원 목록 조회 API
 * @param params 쿼리 파라미터
 */
export async function getMembers(params: Record<string, string>): Promise<GetAdminMembersResponse> {
  const { data } = await apiClient.get<GetAdminMembersResponse>(`/api/admin/members/search`, {
    params,
  });
  return data;
}

/**
 * 관리자 회원 정보 수정 API
 * @param userId 회원 ID
 * @param payload 수정할 데이터
 * @returns void
 */
export async function patchMember(
  userId: number,
  payload: PatchLoanStatusPayload | PatchMemberPayload
): Promise<void> {
  await apiClient.patch(`/api/admin/members/${userId}`, payload);
}

/**
 * 관리자 대출 신청 목록 조회 API
 * @param params 쿼리 파라미터
 *
 * @since 2025.05.19
 * @author 허연규
 */
export async function getLoanApplications(
  params: Record<string, unknown>
): Promise<LoanApiResponse> {
  const { data } = await apiClient.get<LoanApiResponse>(`/api/admin/loans`, { params });
  return data;
}

/**
 * 관리자 대출 상태 정보 수정 API
 * @param applicationId 대출 ID
 * @param payload 수정할 데이터 (상태 및 사유)
 * @returns void
 */
export async function patchLoanStatus(
  applicationId: number,
  payload: PatchLoanStatusPayload
): Promise<void> {
  await apiClient.patch(`/api/admin/loans/${applicationId}/status`, payload);
}

/**
 * 관리자 대출 신청 상세 조회 API
 * @param applicationId 대출 ID
 * @returns 대출 신청 상세 정보
 *
 * @since 2025.05.26
 * @author 권민지
 */
export async function getLoanApplicationDetail(
  applicationId: number
): Promise<LoanDetailsApiResponse> {
  const { data } = await apiClient.get<LoanDetailsApiResponse>(
    `/api/admin/loans/${applicationId}/detail`
  );
  return data;
}
