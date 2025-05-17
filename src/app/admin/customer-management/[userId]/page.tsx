'use client';

import React, { useEffect, useState } from 'react';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Spin } from 'antd';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';

import { TitleRow, Total } from '@/components/admin/Conditionbar/Conditionbar.style';
import DataTable from '@/components/admin/DataTable/DataTable';
import InfoBlock from '@/components/admin/InfoBlock/InfoBlock';
import {
  InfoContainer,
  InfoGrid,
  InfoItem,
  InfoLoanGrid,
  InfoLoanItem,
  Label,
  SectionTitle,
  Value,
} from '@/components/admin/InfoBlock/InfoBlock.style';
import {
  CONSUME_GOAL_LABEL_MAP,
  CONSUMPTION_TYPE_LABEL_MAP,
  SEX_LABEL_MAP,
  MEMBERSTATUS_LABEL_MAP,
} from '@/constants/customer.constant';

import { PageContainer, ContentColumn, HeaderContainer, Title } from './page.style';

/**
 * 관리자 페이지 - 고객 상세 정보 조회 페이지
 * @since 2025.05.12
 * @author 허연규
 */
const CustomerDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const memberId = params.userId as string;
  const [currentPage, setCurrentPage] = useState(0);
  const PAGE_SIZE = 4;

  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.replace('/admin/not-found');
    } else {
      setAccessToken(token);
    }
  }, [router]);

  // 고객 상세 정보 조회 API 호출
  const {
    data: customerData,
    isLoading: customerLoading,
    error: customerError,
  } = useQuery({
    queryKey: ['customerDetail', memberId],
    queryFn: () => fetchCustomerDetail(memberId, accessToken),
    enabled: !!accessToken,
  });

  // 거래 내역 조회 API 호출
  const { data: transactionData, isLoading: transactionLoading } = useQuery({
    queryKey: ['transactionHistory', memberId, currentPage],
    queryFn: async () => {
      const url = `http://localhost:8080/api/admin/loans/members/${memberId}/transactions?page=${currentPage}&size=${PAGE_SIZE}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch transaction history');
      return res.json();
    },
    enabled: !!accessToken,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60,
  });

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    router.back();
  };

  const transactionColumns = [
    { title: '거래 내역 ID', dataIndex: 'transactionId', key: 'transactionId', width: 120 },
    { title: '대출 신청 ID', dataIndex: 'applicationId', key: 'applicationId', width: 120 },
    { title: '회원 ID', dataIndex: 'memberId', key: 'memberId', width: 100 },
    { title: '거래 유형', dataIndex: 'type', key: 'type', width: 100 },
    { title: '거래 금액', dataIndex: 'amount', key: 'amount', width: 120 },
    { title: '발생일시', dataIndex: 'formattedDate', key: 'occurredAt', width: 120 },
    { title: '상태', dataIndex: 'status', key: 'status', width: 100 },
  ];

  interface Transaction {
    transactionId: string;
    applicationId: string;
    memberId: string;
    type: string;
    amount: number;
    occurredAt: string;
    status: string;
  }

  const transactionTableData =
    transactionData?.transactionHistories?.map((transaction: Transaction) => ({
      ...transaction,
      key: transaction.transactionId,
      userId: transaction.memberId,
      formattedDate: dayjs(transaction.occurredAt).format('YYYY-MM-DD'),
    })) || [];

  const showPagination = transactionTableData.length > 0 && transactionData?.paginationInfo;

  const paginationInfo = showPagination
    ? {
        currentPage: (transactionData.paginationInfo.currentPage || 0) + 1,
        pageSize: PAGE_SIZE,
        totalElements: transactionData.paginationInfo.totalElements,
        totalPages: transactionData.paginationInfo.totalPages,
        onChange: (page: number) => setCurrentPage(page - 1),
      }
    : undefined;

  if (customerLoading) {
    return (
      <PageContainer>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (customerError || !customerData) {
    return (
      <PageContainer>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
            gap: '16px',
          }}
        >
          <div>고객 정보를 불러오는데 실패했습니다.</div>
          <Button type="primary" onClick={handleGoBack}>
            목록으로 돌아가기
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentColumn>
        <HeaderContainer>
          <Button icon={<ArrowLeftOutlined />} onClick={handleGoBack} />
          <Title>고객 상세 조회</Title>
        </HeaderContainer>

        {/* 고객 기본 정보 블록 */}
        <InfoBlock>
          <InfoGrid columns={6}>
            <InfoItem>
              <Label>이름</Label>
              <Value>{customerData.name}</Value>
            </InfoItem>
            <InfoItem>
              <Label>성별</Label>
              <Value>{SEX_LABEL_MAP[customerData.sex]}</Value>
            </InfoItem>
            <InfoItem>
              <Label>사용자 상태</Label>
              <Value>{MEMBERSTATUS_LABEL_MAP[customerData.status]}</Value>
            </InfoItem>
            <InfoItem>
              <Label>생년월일</Label>
              <Value>{customerData.birthDate}</Value>
            </InfoItem>
            <InfoItem>
              <Label>가입일</Label>
              <Value>{dayjs(customerData.createdAt).format('YYYY-MM-DD')}</Value>
            </InfoItem>
            <InfoItem>
              <Label>대출 거래 횟수</Label>
              <Value>{customerData.loanTransactionCount}</Value>
            </InfoItem>
          </InfoGrid>
        </InfoBlock>
        <div style={{ display: 'flex', gap: '32px' }}>
          {/* 고객 소비 성향 정보 블록 */}
          <div style={{ flex: '0 0 500px' }}>
            <InfoBlock>
              <SectionTitle>고객 정보</SectionTitle>
              <InfoContainer>
                <InfoGrid columns={1}>
                  <InfoItem>
                    <Label>소비 성향</Label>
                    <Value>{CONSUMPTION_TYPE_LABEL_MAP[customerData.consumptionType]}</Value>
                  </InfoItem>
                  <InfoItem>
                    <Label>소비 목표</Label>
                    <Value>{CONSUME_GOAL_LABEL_MAP[customerData.consumeGoal]}</Value>
                  </InfoItem>
                </InfoGrid>
              </InfoContainer>
            </InfoBlock>
          </div>
          {/* 대출 정보 블록 - 대출이 있는 경우에만 표시 */}
          {customerData.hasLoan && (
            <div style={{ flex: 1 }}>
              <InfoBlock>
                <SectionTitle>진행중 대출 상태</SectionTitle>
                <InfoContainer>
                  <InfoLoanGrid>
                    <InfoLoanItem>
                      <Label>대출 시작일</Label>
                      <Value>{dayjs(customerData.loanStartDate).format('YYYY-MM-DD')}</Value>
                    </InfoLoanItem>
                    <InfoLoanItem>
                      <Label>대출 종료일</Label>
                      <Value>{dayjs(customerData.loanEndDate).format('YYYY-MM-DD')}</Value>
                    </InfoLoanItem>
                    <InfoLoanItem>
                      <Label>대출 원금</Label>
                      <Value>{customerData.loanAmount.toLocaleString()}원</Value>
                    </InfoLoanItem>
                    <InfoLoanItem>
                      <Label>월 납입 금액</Label>
                      <Value>{customerData.monthlyPayment.toLocaleString()}원</Value>
                    </InfoLoanItem>
                    <InfoLoanItem>
                      <Label>납입일</Label>
                      <Value>매달 {customerData.paymentDue}일</Value>
                    </InfoLoanItem>
                    <InfoLoanItem>
                      <Label>대출 이자율</Label>
                      <Value>{customerData.interestRate}%</Value>
                    </InfoLoanItem>
                    <InfoLoanItem>
                      <Label>신용평가 점수</Label>
                      <Value>{customerData.creditScore}점</Value>
                    </InfoLoanItem>
                  </InfoLoanGrid>
                </InfoContainer>
              </InfoBlock>
            </div>
          )}
        </div>

        {/* 상환 내역 테이블 */}
        <TitleRow>
          <Title>상환 내역 조회</Title>
          {paginationInfo?.totalElements && <Total>{paginationInfo.totalElements}회</Total>}
        </TitleRow>
        <DataTable
          data={transactionTableData || []}
          loading={transactionLoading}
          columnMetas={transactionColumns}
          paginationInfo={paginationInfo}
          linkPrefix="/admin/customers/"
        />
      </ContentColumn>
    </PageContainer>
  );
};

// 고객 상세 정보 조회 API 호출 함수
const fetchCustomerDetail = async (memberId: string, adminToken: string | null) => {
  const url = `http://localhost:8080/api/admin/members/${memberId}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('고객 정보 조회 실패');
  }

  return res.json();
};

export default CustomerDetailPage;
