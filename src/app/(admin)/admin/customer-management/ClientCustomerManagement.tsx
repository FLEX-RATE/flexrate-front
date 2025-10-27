'use client';

import React, { useState } from 'react';

import Button from 'antd/es/button';
import DatePicker from 'antd/es/date-picker';
import Input from 'antd/es/input';
import InputNumber from 'antd/es/input-number';
import Select from 'antd/es/select';
import Space from 'antd/es/space';
import dayjs, { Dayjs } from 'dayjs';
import dynamic from 'next/dynamic';

import { useMe } from '@/hooks/useMe';
import { useMembersQuery } from '@/hooks/useMembersQuery';
import { usePatchMember } from '@/hooks/usePatchMember';
import { useFilterStore } from '@/stores/filterStore';
import type { FilterType } from '@/types/filter.type';

import { PageContainer, ContentColumn, FilterRow, FilterLabel } from './page.style';

const DataTable = dynamic(() => import('@/components/admin/DataTable/DataTable'), {
  ssr: false,
  loading: () => <div style={{ padding: 16 }}>테이블 불러오는 중…</div>,
});
const Conditionbar = dynamic(() => import('@/components/admin/Conditionbar/Conditionbar'), {
  ssr: false,
  loading: () => <div style={{ padding: 16 }}>상단 바 준비 중…</div>,
});

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

const ClientCustomerManagement = () => {
  const { RangePicker } = DatePicker;

  const { data: me, isLoading: meLoading } = useMe();
  const isAdmin = !!me && me.role === 'ADMIN';

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
  } = useFilterStore();

  const [page, setPage] = useState(1);
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

  const toDayjsRange = (range?: [string, string] | null): [Dayjs | null, Dayjs | null] | null => {
    if (!range) return null;
    const [s, e] = range;
    if (!s || !e) return null;
    return [dayjs(s), dayjs(e)];
  };

  const handleTempFilterChange = <K extends keyof FilterType>(key: K, value: FilterType[K]) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

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

  const { data, isLoading } = useMembersQuery(filters, page, PAGE_SIZE);
  const patchMemberMutation = usePatchMember(filters, page, PAGE_SIZE);

  if (meLoading) return <div style={{ padding: 16 }}>권한 확인 중…</div>;
  if (!isAdmin) return null;

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleChange = (value: string, dataIndex?: string, record?: { userId: number }) => {
    if (!record?.userId || !dataIndex) return;
    patchMemberMutation.mutate({ userId: record.userId, payload: { [dataIndex]: value } });
  };

  return (
    <PageContainer>
      <ContentColumn>
        <Conditionbar
          title="고객 관리"
          totalElements={
            data?.paginationInfo?.totalElements ? `${data.paginationInfo.totalElements}명` : '0명'
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
                onChange={(v) => handleTempFilterChange('sex', v)}
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
                value={toDayjsRange(tempFilters.birthDateRange ?? null)}
                onChange={(_, dateStrings) =>
                  handleTempFilterChange('birthDateRange', dateStrings as [string, string])
                }
                style={{ width: 240 }}
              />
            </FilterRow>

            <FilterRow>
              <FilterLabel>사용자 상태</FilterLabel>
              <Select
                value={tempFilters.memberStatus}
                onChange={(v) => handleTempFilterChange('memberStatus', v)}
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
                value={toDayjsRange(tempFilters.createdDateRange ?? null)}
                onChange={(_, dateStrings) =>
                  handleTempFilterChange('createdDateRange', dateStrings as [string, string])
                }
                style={{ width: 240 }}
              />
            </FilterRow>

            <FilterRow>
              <FilterLabel>대출중 여부</FilterLabel>
              <Select
                value={tempFilters.hasLoan}
                onChange={(v) => handleTempFilterChange('hasLoan', v)}
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
                onChange={(v) => handleTempFilterChange('transactionCountMin', v ?? 0)}
                style={{ width: 65 }}
              />
              <p>~</p>
              <InputNumber
                min={0}
                max={100}
                value={tempFilters.transactionCountMax}
                onChange={(v) => handleTempFilterChange('transactionCountMax', v ?? 0)}
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
          data={(data?.members || []).map((m) => ({ ...m, handleChange }))}
          paginationInfo={{
            currentPage: page,
            pageSize: data?.paginationInfo?.pageSize || PAGE_SIZE,
            totalElements: data?.paginationInfo?.totalElements || 0,
            totalPages: data?.paginationInfo?.totalPages || 0,
            onChange: handlePageChange,
          }}
        />
      </ContentColumn>
    </PageContainer>
  );
};

export default ClientCustomerManagement;
