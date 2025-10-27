import React, { useMemo } from 'react';

import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { getMembers } from '@/apis/admin';
import { RawMember } from '@/types/admin.type';
import { FilterType } from '@/types/filter.type';
import { PaginationInfo } from '@/types/pagination.type';
import { filtersToParams } from '@/utils/memberParams';

const PAGE_SIZE = 8;

/** 테이블 행 */
export interface CustomerTableRow {
  key: React.Key;
  no: number;
  name: string;
  email: string;
  sex: string;
  birthDate: string;
  userId: number;
  hasLoan: string;
  memberStatus: string;
  createdAt: string;
  transactionCount: number;
  lastLoginAt: string;
  [key: string]: unknown;
}

/** 관리자 목록 API 원본 응답 타입 */
interface GetMembersResponse {
  members: RawMember[];
  paginationInfo: PaginationInfo;
}

/** 쿼리 결과(매핑 후) 타입 */
interface MembersResultData {
  members: CustomerTableRow[];
  paginationInfo: PaginationInfo;
}

/** filters -> params 메모 */
function useMembersQueryParams(filters: FilterType, page: number, size: number = PAGE_SIZE) {
  return useMemo<ReturnType<typeof filtersToParams>>(
    () => filtersToParams(filters, page, size),
    [filters, page, size]
  );
}

/**
 * 관리자 회원 목록 조회 훅
 */
export const useMembersQuery = (
  filters: FilterType,
  page: number,
  size: number = PAGE_SIZE,
  options?: UseQueryOptions<MembersResultData, unknown, MembersResultData, ['customers', string]>
) => {
  const params = useMembersQueryParams(filters, page, size);
  const queryKey: ['customers', string] = ['customers', JSON.stringify(params)];

  const queryResult: UseQueryResult<MembersResultData, unknown> = useQuery({
    queryKey,
    queryFn: async (): Promise<MembersResultData> => {
      const data = (await getMembers(params)) as GetMembersResponse;

      const { members, paginationInfo } = data;
      const mappedMembers: CustomerTableRow[] = members.map((member, idx) => ({
        key: member.id,
        no: paginationInfo.currentPage * paginationInfo.pageSize + idx + 1,
        name: member.name,
        email: member.email,
        sex: getSex(member.sex),
        birthDate: member.birthDate,
        userId: member.id,
        hasLoan: member.hasLoan ? '대출중' : '대출중 아님',
        memberStatus: getMemberStatus(member.memberStatus),
        createdAt: dayjs(member.createdAt).format('YYYY-MM-DD'),
        transactionCount: member.loanTransactionCount,
        lastLoginAt: member.lastLoginAt,
      }));

      return { members: mappedMembers, paginationInfo };
    },
    staleTime: 30_000,
    ...options,
  });

  return {
    ...queryResult,
    members: queryResult.data?.members ?? [],
    paginationInfo: queryResult.data?.paginationInfo,
  };
};

/** 상태/성별 매핑 유틸 */
function getMemberStatus(status: RawMember['memberStatus']): string {
  switch (status) {
    case 'ACTIVE':
      return '활성';
    case 'WITHDRAWN':
      return '탈퇴';
    case 'SUSPENDED':
      return '정지';
    default:
      return '-';
  }
}

function getSex(sex: RawMember['sex']): string {
  switch (sex) {
    case 'MALE':
      return '남';
    case 'FEMALE':
      return '여';
    default:
      return '-';
  }
}
