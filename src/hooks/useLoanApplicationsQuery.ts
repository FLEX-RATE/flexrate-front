import React, { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { getLoanApplications } from '@/apis/admin';
import { RawLoanApplication } from '@/types/admin.type';
import { LoanFilterType } from '@/types/loan.filter.type';
import { filtersToLoanApplicationParams } from '@/utils/loanApplicationParams';
import { displayValue } from '@/utils/nullDisplay';

const PAGE_SIZE = 8;

/**
 * 대출 신청 테이블 행 데이터 타입
 */
export interface LoanApplicationTableRow {
  key: React.Key;
  no: number;
  status: string;
  applicationDate: string;
  applicantName: string;
  loanLimit: string;
  initialInterestRate: string;
  previousLoanCount: number;
  loanType: string;
  applicationId: number;
  userId: number;
  handleChange?: (newValue: string, dataIndex?: string, record?: LoanApplicationTableRow) => void;

  [key: string]: unknown;
}

/**
 * 대출 상태 변환 함수
 * @param status 대출 신청 상태
 */
function getLoanStatus(status: RawLoanApplication['status']) {
  switch (status) {
    case 'PRE_APPLIED':
      return '신청 접수중';
    case 'PENDING':
      return '심사중';
    case 'REJECTED':
      return '거절';
    case 'EXECUTED':
      return '실행중';
    case 'COMPLETED':
      return '상환 완료';
    case 'NONE':
      return '초기';
    default:
      return '-';
  }
}

/**
 * 대출 유형 변환 함수
 * @param type 대출 유형
 */
function getLoanType(type: RawLoanApplication['type']) {
  switch (type) {
    case 'NEW':
      return '신규';
    case 'EXTENSION':
      return '연장';
    case 'REDEVELOPMENT':
      return '재가입';
    default:
      return '-';
  }
}

/**
 * 이자율 포맷팅 함수
 * @param rate 이자율
 */
function formatInterestRate(rate: number) {
  return `${rate.toFixed(2)}%`;
}

/**
 * 관리자 대출 신청 조회용 쿼리 파라미터 변환 훅
 * @param filters - 조회 조건 필터
 * @param page - 페이지 번호
 * @param size - 페이지 크기 (기본값: 8)
 *
 * @since 2025.05.18
 * @author 허연규
 */
function useLoanApplicationQueryParams(filters: LoanFilterType, page: number, size: number = 8) {
  return useMemo(() => filtersToLoanApplicationParams(filters, page, size), [filters, page, size]);
}

/**
 * 관리자 대출 신청 목록 조회 API
 * @param filters 조회 필터
 * @param page 페이지 번호
 * @param size 페이지 크기 (기본값: 8)
 *
 * @since 2025.05.18
 * @author 허연규
 */
export const useLoanApplicationsQuery = (
  filters: LoanFilterType,
  page: number,
  size: number = PAGE_SIZE
) => {
  const params = useLoanApplicationQueryParams(filters, page, size);
  const queryKey = ['loanApplications', JSON.stringify(params)];

  const queryResult = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const data = await getLoanApplications(params);
        const { paginationInfo, loans } = data;

        const currentPage = Number(paginationInfo.currentPage) || 0;
        const pageSize = Number(paginationInfo.pageSize) || size;
        const totalElements = Number(paginationInfo.totalElements) || 0;
        const totalPages = Number(paginationInfo.totalPages) || 0;

        const frontendPage = currentPage + 1;
        const startIndex = currentPage * pageSize;

        const mappedLoanApplications: LoanApplicationTableRow[] = loans.map((loan, idx) => ({
          key: loan.id,
          no: startIndex + idx + 1,
          status: getLoanStatus(loan.status),
          applicationDate: dayjs(loan.appliedAt).format('YYYY-MM-DD'),
          applicantName: loan.applicant,
          loanLimit: displayValue(loan.availableLimit, (v) => `${v?.toLocaleString()}원`),
          initialInterestRate: formatInterestRate(loan.initialRate),
          previousLoanCount: loan.prevLoanCount,
          loanType: getLoanType(loan.type),
          applicationId: loan.id,
          userId: loan.applicantId,
        }));

        return {
          loanApplications: mappedLoanApplications,
          paginationInfo: {
            currentPage: frontendPage,
            pageSize,
            totalElements,
            totalPages,
          },
        };
      } catch (error: unknown) {
        console.error('Error fetching loan application data:', error);
        throw new Error(`Failed to fetch loan application data: ${error}`);
      }
    },
    enabled: !!params,
    staleTime: 1000 * 30,
  });

  return {
    ...queryResult,
    loanApplications: queryResult.data?.loanApplications ?? [],
    paginationInfo: queryResult.data?.paginationInfo ?? {
      currentPage: 1,
      pageSize: size,
      totalElements: 0,
      totalPages: 0,
    },
  };
};
