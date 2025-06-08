'use client';

import React, { useEffect, useState } from 'react';

import { Input, InputNumber, Select, Space, Button, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

import Conditionbar from '@/components/admin/Conditionbar/Conditionbar';
import DataTable from '@/components/admin/DataTable/DataTable';
import { useMembersQuery } from '@/hooks/useMembersQuery';
import { usePatchMember } from '@/hooks/usePatchMember';
import { useFilterStore } from '@/stores/filterStore';
import { useUserStore } from '@/stores/userStore';
import type { FilterType } from '@/types/filter.type';

import { PageContainer, ContentColumn, FilterRow, FilterLabel } from './page.style';

const PAGE_SIZE = 8;

const CUSTOMER_COLUMN_METAS = [
  { title: 'No', dataIndex: 'no', key: 'no', width: 50, editable: false },
  { title: '이름', dataIndex: 'name', key: 'name', width: 90, editable: true, inputType: 'text' },
  { title: '이메일', dataIndex: 'email', key: 'email', width: 180 },
  {
    title: '성별',
    dataIndex: 'sex',
    key: 'sex',
    width: 80,
    editable: true,
    inputType: 'select',
    options: [
      { value: 'FEMALE', label: '여' },
      { value: 'MALE', label: '남' },
    ],
  },
  {
    title: '생년월일',
    dataIndex: 'birthDate',
    key: 'birthDate',
    width: 130,
    editable: true,
    inputType: 'date',
  },
  {
    title: '상태',
    dataIndex: 'memberStatus',
    key: 'memberStatus',
    width: 80,
    editable: true,
    inputType: 'select',
    options: [
      { value: 'ACTIVE', label: '활성' },
      { value: 'WITHDRAWN', label: '탈퇴' },
      { value: 'SUSPENDED', label: '정지' },
    ],
  },
  { title: '가입일', dataIndex: 'createdAt', key: 'createdAt', width: 130, editable: false },
  {
    title: '대출 횟수',
    dataIndex: 'transactionCount',
    key: 'transactionCount',
    width: 90,
    editable: false,
  },
  { title: '대출 상태', dataIndex: 'hasLoan', key: 'hasLoan', width: 100, editable: false },
  { title: '', dataIndex: 'userId', key: 'userId', width: 60, editable: false },
] as const;

/**
 * 관리자 페이지 - 고객 관리 메뉴
 * @since 2025.05.12
 * @lastmodified 2025.05.16
 * @author 권민지
 */
const CustomerManagementPage = () => {
  const { RangePicker } = DatePicker;
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const token = useUserStore((state) => state.accessToken);

  const filterStore = useFilterStore();
  const {
    name,
    setName,
    sex,
    setSex,
    birthDateRange,
    setBirthRange,
    memberStatus,
    setMemberStatus,
    createdDateRange,
    setCreatedDateRange,
    hasLoan,
    setHasLoan,
    transactionCountMin,
    setTransactionCountMin,
    transactionCountMax,
    setTransactionCountMax,
  } = filterStore;

  const [page, setPage] = useState(1);

  // 필터 조회 전 입력값 보관용 임시 필터
  const [tempFilters, setTempFilters] = useState<FilterType>({
    name,
    sex,
    birthDateRange,
    memberStatus,
    createdDateRange,
    hasLoan,
    transactionCountMin,
    transactionCountMax,
  });

  // 조회용 필터
  const filters: FilterType = {
    name,
    sex,
    birthDateRange,
    memberStatus,
    createdDateRange,
    hasLoan,
    transactionCountMin,
    transactionCountMax,
  };

  /**
   * 핸들러 및 유틸 함수
   */
  // 임시 필터 변경 핸들러
  const handleTempFilterChange = <K extends keyof FilterType>(key: K, value: FilterType[K]) => {
    setTempFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 날짜 범위 dayjs 객체 배열로 변환
  const toDayjsRange = (
    range?: [string, string]
  ): [dayjs.Dayjs | null, dayjs.Dayjs | null] | undefined => {
    if (range && range[0] && range[1]) {
      return [dayjs(range[0]), dayjs(range[1])];
    }
    return undefined;
  };

  // 필터 적용 및 조회 버튼 클릭 핸들러
  const handleSearchClick = () => {
    setName(tempFilters.name);
    setSex(tempFilters.sex);
    setBirthRange(tempFilters.birthDateRange);
    setMemberStatus(tempFilters.memberStatus);
    setCreatedDateRange(tempFilters.createdDateRange);
    setHasLoan(tempFilters.hasLoan);
    setTransactionCountMin(tempFilters.transactionCountMin);
    setTransactionCountMax(tempFilters.transactionCountMax);
    setPage(1);
  };

  // 회원 정보 변경 핸들러
  const handleChange = (value: string, dataIndex?: string, record?: { userId: number }) => {
    if (!record?.userId || !accessToken || !dataIndex) return;

    patchMemberMutation.mutate({
      userId: record.userId,
      payload: { [dataIndex]: value },
      accessToken,
    });
  };

  /**
   * 데이터 패치 및 인증
   */
  // 최초 렌더링 시 accessToken 확인 및 설정
  useEffect(() => {
    if (!token) {
      router.replace('/admin/not-found');
    } else {
      setAccessToken(token);
    }
  }, [router]);

  // 회원 목록 및 수정 뮤테이션 훅
  const { data, isLoading } = useMembersQuery(filters, accessToken || '', page, PAGE_SIZE);
  const patchMemberMutation = usePatchMember(filters, accessToken || '', page, PAGE_SIZE);

  return (
    <PageContainer>
      <ContentColumn>
        <Conditionbar
          title="고객 관리"
          totalElements={
            data?.paginationInfo.totalElements ? `${data.paginationInfo.totalElements}명` : '0명'
          }
        >
          <Space wrap size="middle">
            <FilterRow>
              <FilterLabel>이름</FilterLabel>
              <Input
                placeholder="이름"
                value={tempFilters.name}
                onChange={(e) => handleTempFilterChange('name', e.target.value)}
                style={{ width: 130 }}
              />
            </FilterRow>

            <FilterRow>
              <FilterLabel>성별</FilterLabel>
              <Select
                value={tempFilters.sex}
                onChange={(e) => handleTempFilterChange('sex', e)}
                options={[
                  { value: 'ALL', label: '모두' },
                  { value: 'FEMALE', label: '여성' },
                  { value: 'MALE', label: '남성' },
                ]}
                style={{ width: 80 }}
              />
            </FilterRow>

            <FilterRow>
              <FilterLabel>생년월일</FilterLabel>
              <RangePicker
                format="YYYY-MM-DD"
                value={toDayjsRange(tempFilters.birthDateRange || undefined)}
                onChange={(_, dateStrings) => handleTempFilterChange('birthDateRange', dateStrings)}
                style={{ width: 240 }}
              />
            </FilterRow>

            <FilterRow>
              <FilterLabel>사용자 상태</FilterLabel>
              <Select
                value={tempFilters.memberStatus}
                onChange={(value) => handleTempFilterChange('memberStatus', value)}
                options={[
                  { value: 'ALL', label: '모두' },
                  { value: 'ACTIVE', label: '활성' },
                  { value: 'WITHDRAWN', label: '탈퇴' },
                  { value: 'SUSPENDED', label: '정지' },
                ]}
                style={{ width: 100 }}
              />
            </FilterRow>

            <FilterRow>
              <FilterLabel>가입일</FilterLabel>
              <RangePicker
                format="YYYY-MM-DD"
                value={toDayjsRange(tempFilters.createdDateRange || undefined)}
                onChange={(_, dateStrings) =>
                  handleTempFilterChange('createdDateRange', dateStrings)
                }
                style={{ width: '240px' }}
              />
            </FilterRow>

            <FilterRow>
              <FilterLabel>대출중 여부</FilterLabel>
              <Select
                value={tempFilters.hasLoan}
                onChange={(value) => handleTempFilterChange('hasLoan', value)}
                options={[
                  { value: 'ALL', label: '모두' },
                  { value: 'TRUE', label: '대출중' },
                  { value: 'FALSE', label: '대출중 아님' },
                ]}
                style={{ width: 120 }}
              />
            </FilterRow>

            <FilterRow>
              <FilterLabel>거래내역 횟수</FilterLabel>
              <InputNumber
                min={0}
                max={100}
                value={tempFilters.transactionCountMin}
                onChange={(value) => handleTempFilterChange('transactionCountMin', value)}
                style={{ width: 65 }}
              />
              <p>~</p>
              <InputNumber
                min={0}
                max={100}
                value={tempFilters.transactionCountMax}
                onChange={(value) => handleTempFilterChange('transactionCountMax', value)}
                style={{ width: 65 }}
              />
            </FilterRow>
          </Space>

          <Button type="primary" onClick={handleSearchClick}>
            조회
          </Button>
        </Conditionbar>

        <DataTable
          loading={isLoading}
          columnMetas={[...CUSTOMER_COLUMN_METAS]}
          linkPrefix="/admin/customer-management/"
          data={(data?.members || []).map((member) => ({
            ...member,
            handleChange: handleChange,
          }))}
          paginationInfo={{
            currentPage: page,
            pageSize: data?.paginationInfo.pageSize || PAGE_SIZE,
            totalElements: data?.paginationInfo.totalElements || 0,
            totalPages: data?.paginationInfo.totalPages || 0,
            onChange: handlePageChange,
          }}
        />
      </ContentColumn>
    </PageContainer>
  );
};

export default CustomerManagementPage;
