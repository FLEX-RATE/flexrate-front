'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Input, InputNumber, Select, Space, Button, DatePicker, Form, message } from 'antd';
import { isAxiosError } from 'axios';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

import { getLoanApplicationDetail } from '@/apis/admin';
import { SubContainer } from '@/app/mypage/page.style';
import Conditionbar from '@/components/admin/Conditionbar/Conditionbar';
import DataTable from '@/components/admin/DataTable/DataTable';
import LoanStatusChangeModal from '@/components/admin/LoanStatusChangeModal/LoanStatusChangeModal';
import FlexrateButton from '@/components/Button/Button';
import { FlexContainer } from '@/components/loanApplicationFunnel/CreditStep/CreditStep.style';
import TextField from '@/components/TextField/TextField';
import {
  STATUS_LABEL,
  EMPLOYMENT_TYPE_LABEL,
  RESIDENCE_TYPE_LABEL,
  BANKRUPT_LABEL,
  LOAN_PURPOSE_LABEL,
} from '@/constants/loan.constant';
import {
  LoanApplicationTableRow,
  useLoanApplicationsQuery,
} from '@/hooks/useLoanApplicationsQuery';
import { usePatchLoanStatus } from '@/hooks/usePatchLoanStatus';
import { useLoanFilterStore } from '@/stores/loanFilterStore';
import { useUserStore } from '@/stores/userStore';
import type { LoanDetailsApiResponse } from '@/types/admin.type';
import type { LoanFilterType } from '@/types/loan.filter.type';
import { formatYMD } from '@/utils/dateFormat';
import { filtersToLoanApplicationParams } from '@/utils/loanApplicationParams';
import { displayValue } from '@/utils/nullDisplay';

import {
  PageContainer,
  ContentColumn,
  FilterRow,
  FilterLabel,
  ModalTitle,
  ModalInfoContainer,
  ModalInfoKeyColumn,
  InfoLabel,
  InfoValue,
  ModalInfoValueColumn,
  ModalSubTitle,
  ModalColumnContainer,
  ModalRowContainer,
  InfoBottomText,
  ErrorInfo,
  DivideMargin,
} from './page.style';

const PAGE_SIZE = 8;

const LOAN_APPLICATION_COLUMN_METAS = [
  { title: 'No', dataIndex: 'no', key: 'no', width: 50, editable: false },
  {
    title: '상태',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    editable: true,
    inputType: 'select',
    options: [
      { value: 'PRE_APPLIED', label: '신청 접수' },
      { value: 'PENDING', label: '심사중' },
      { value: 'REJECTED', label: '거절' },
      { value: 'EXECUTED', label: '실행중' },
      { value: 'COMPLETED', label: '상환 완료' },
      { value: 'NONE', label: '초기' },
    ],
  },
  {
    title: '신청일',
    dataIndex: 'applicationDate',
    key: 'applicationDate',
    width: 120,
    editable: false,
  },
  { title: '신청자', dataIndex: 'applicantName', key: 'applicantName', width: 90, editable: false },
  {
    title: '남은 대출 금액',
    dataIndex: 'loanLimit',
    key: 'loanLimit',
    width: 120,
    editable: false,
  },
  {
    title: '초기 대출 금리',
    dataIndex: 'initialInterestRate',
    key: 'initialInterestRate',
    width: 120,
    editable: false,
  },
  {
    title: '기존 대출 횟수',
    dataIndex: 'previousLoanCount',
    key: 'previousLoanCount',
    width: 120,
    editable: false,
  },
  {
    title: '신규/연장/재가입 여부',
    dataIndex: 'loanType',
    key: 'loanType',
    width: 150,
    editable: false,
  },
  { title: '', dataIndex: 'userId', key: 'userId', width: 60, editable: false },
] as const;

const CHANGEABLE_STATUSES = [
  'PRE_APPLIED',
  'PENDING',
  'EXECUTED',
  'COMPLETED',
  'NONE',
  'REJECTED',
] as const;
type ChangeableStatus = (typeof CHANGEABLE_STATUSES)[number];

/**
 * 관리자 페이지 - 대출 신청 현황 메뉴
 * @since 2025.05.18
 * @author 허연규
 */
const AdminLoanApplicationPage = () => {
  const { RangePicker } = DatePicker;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [accessToken, setAccessToken] = useState<string | null>(
    useUserStore((state) => state.accessToken)
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [statusChangeForm] = Form.useForm();
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    record: LoanApplicationTableRow;
    newStatus: string;
  } | null>(null);
  const [detail, setDetail] = useState<LoanDetailsApiResponse | null>(null);
  const [page, setPage] = useState(1);
  const isChangeable =
    detail &&
    detail.applicationStatus &&
    CHANGEABLE_STATUSES.includes(detail?.applicationStatus as ChangeableStatus);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const loanFilterStore = useLoanFilterStore();
  const {
    status,
    setStatus,
    applicationDateRange,
    setApplicationDateRange,
    applicantName,
    setApplicantName,
    loanLimitMin,
    setLoanLimitMin,
    loanLimitMax,
    setLoanLimitMax,
    initialInterestRateMin,
    setInitialInterestRateMin,
    initialInterestRateMax,
    setInitialInterestRateMax,
    previousLoanCountMin,
    setPreviousLoanCountMin,
    previousLoanCountMax,
    setPreviousLoanCountMax,
    loanType,
    setLoanType,
  } = loanFilterStore;

  // 필터 조회 전 입력값 보관용 임시 필터
  const [tempFilters, setTempFilters] = useState<LoanFilterType>({
    status,
    applicationDateRange,
    applicantName,
    loanLimitMin,
    loanLimitMax,
    initialInterestRateMin,
    initialInterestRateMax,
    previousLoanCountMin,
    previousLoanCountMax,
    loanType,
  });

  // 조회용 필터
  const filters: LoanFilterType = {
    status,
    applicationDateRange,
    applicantName,
    loanLimitMin,
    loanLimitMax,
    initialInterestRateMin,
    initialInterestRateMax,
    previousLoanCountMin,
    previousLoanCountMax,
    loanType,
  };

  /**
   * 핸들러 및 유틸 함수
   */
  // 임시 필터 변경 핸들러
  const handleTempFilterChange = <K extends keyof LoanFilterType>(
    key: K,
    value: LoanFilterType[K]
  ) => {
    setTempFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleStatusChange = useCallback(
    (_: string, dataIndex?: string, record?: LoanApplicationTableRow) => {
      if (!record?.applicationId || !accessToken || dataIndex !== 'status') {
        console.error('상태 변경 실패: 필수 정보 누락', { record, accessToken, dataIndex });
        return;
      }

      setPendingStatusChange({
        record,
        newStatus: record.status,
      });

      setIsModalVisible(true);
      setReason('');
      setReasonError('');
    },
    [accessToken]
  );

  // 모달 데이터 패치
  useEffect(() => {
    if (isModalVisible && pendingStatusChange?.record?.applicationId && accessToken) {
      getLoanApplicationDetail(pendingStatusChange.record.applicationId, accessToken)
        .then(setDetail)
        .catch(() => setDetail(null));
    }
    if (!isModalVisible) {
      setDetail(null);
    }
  }, [isModalVisible, pendingStatusChange?.record?.applicationId, accessToken]);

  // 모달 취소 핸들러
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setPendingStatusChange(null);

    const params = filtersToLoanApplicationParams(filters, page, PAGE_SIZE);
    queryClient.invalidateQueries({
      queryKey: ['loanApplications', JSON.stringify(params), accessToken],
    });
  };

  // 모달 확인 핸들러
  const handleModalOk = (newStatus: string) => {
    if (!reason.trim()) {
      setReasonError('변경 사유를 입력해주세요');
      return;
    }
    setReasonError('');

    if (!detail || !accessToken) {
      setIsModalVisible(false);
      return;
    }

    statusChangeForm
      .validateFields()
      .then(() => {
        // 로딩 메시지 표시
        const messageKey = 'statusChangeLoading';
        message.loading({ content: '상태 변경 중...', key: messageKey, duration: 0 });

        patchStatusMutation.mutate(
          {
            applicationId: detail.applicationId,
            payload: { status: newStatus, reason },
            accessToken,
          },
          {
            onSuccess: () => {
              message.success({ content: '상태가 성공적으로 변경되었습니다.', key: messageKey });
              setIsModalVisible(false);
              setPendingStatusChange(null);
              queryClient.invalidateQueries({
                queryKey: [
                  'loanApplications',
                  JSON.stringify(filtersToLoanApplicationParams(filters, page, PAGE_SIZE)),
                  accessToken,
                ],
              });
            },
            onError: (error) => {
              let errorMessage = '알 수 없는 오류가 발생했습니다.';

              if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
              }

              message.error({
                content: `상태 변경 실패: ${errorMessage}`,
                key: messageKey,
              });

              // 오류 발생 시 데이터 다시 로드
              const params = filtersToLoanApplicationParams(filters, page, PAGE_SIZE);
              queryClient.invalidateQueries({
                queryKey: ['loanApplications', JSON.stringify(params), accessToken],
              });
            },
          }
        );
      })
      .catch((info) => {
        console.error('폼 검증 실패:', info);
      });
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
    setStatus(tempFilters.status);
    setApplicationDateRange(tempFilters.applicationDateRange);
    setApplicantName(tempFilters.applicantName);
    setLoanLimitMin(tempFilters.loanLimitMin);
    setLoanLimitMax(tempFilters.loanLimitMax);
    setInitialInterestRateMin(tempFilters.initialInterestRateMin);
    setInitialInterestRateMax(tempFilters.initialInterestRateMax);
    setPreviousLoanCountMin(tempFilters.previousLoanCountMin);
    setPreviousLoanCountMax(tempFilters.previousLoanCountMax);
    setLoanType(tempFilters.loanType);
    setPage(1);
  };

  /**
   * 데이터 패치 및 인증
   */
  // 최초 렌더링 시 accessToken 확인 및 설정
  useEffect(() => {
    if (!accessToken) {
      router.replace('/admin/not-found');
    } else {
      setAccessToken(accessToken);
    }
  }, [router]);

  // 대출 신청 목록 조회, 상태 수정 훅
  const { data, isLoading } = useLoanApplicationsQuery(filters, accessToken || '', page, PAGE_SIZE);
  const patchStatusMutation = usePatchLoanStatus(filters, accessToken || '', page, PAGE_SIZE);

  // 테이블 데이터에 상태 변경 핸들러 추가
  const tableData = React.useMemo(() => {
    return (data?.loanApplications || []).map((application) => ({
      ...application,
      handleChange: handleStatusChange,
    }));
  }, [data?.loanApplications, handleStatusChange]);

  return (
    <PageContainer>
      <ContentColumn>
        <Conditionbar
          title="대출 신청 현황"
          totalElements={
            data?.paginationInfo.totalElements ? `${data.paginationInfo.totalElements}개` : '0개'
          }
        >
          <Space wrap size="middle">
            <FilterRow>
              <FilterLabel>상태</FilterLabel>
              <Select
                value={tempFilters.status}
                onChange={(e) => handleTempFilterChange('status', e)}
                options={[
                  { value: 'ALL', label: '전체' },
                  { value: 'PRE_APPLIED', label: '신청 접수중' },
                  { value: 'PENDING', label: '심사중' },
                  { value: 'REJECTED', label: '거절' },
                  { value: 'EXECUTED', label: '실행중' },
                  { value: 'COMPLETED', label: '상환 완료' },
                  { value: 'NONE', label: '초기' },
                ]}
                style={{ width: 100 }}
              />
            </FilterRow>

            <FilterRow>
              <FilterLabel>신청일</FilterLabel>
              <RangePicker
                format="YYYY-MM-DD"
                value={toDayjsRange(tempFilters.applicationDateRange || undefined)}
                onChange={(_, dateStrings) =>
                  handleTempFilterChange('applicationDateRange', dateStrings)
                }
                style={{ width: 240 }}
              />
            </FilterRow>

            <FilterRow>
              <FilterLabel>신청자</FilterLabel>
              <Input
                placeholder="이름"
                value={tempFilters.applicantName}
                onChange={(e) => handleTempFilterChange('applicantName', e.target.value)}
                style={{ width: 130 }}
              />
            </FilterRow>

            <FilterRow>
              <FilterLabel>남은 대출 금액</FilterLabel>
              <InputNumber
                min={0}
                max={5000000}
                step={100000}
                placeholder="0"
                value={tempFilters.loanLimitMin}
                onChange={(value) => handleTempFilterChange('loanLimitMin', value)}
                style={{ width: 120 }}
              />
              <p>~</p>
              <InputNumber
                min={0}
                max={5000000}
                step={100000}
                placeholder="5,000,000"
                value={tempFilters.loanLimitMax}
                onChange={(value) => handleTempFilterChange('loanLimitMax', value)}
                style={{ width: 120 }}
              />
            </FilterRow>

            <FilterRow>
              <FilterLabel>초기 대출 금리</FilterLabel>
              <InputNumber
                min={3.0}
                max={12.0}
                step={0.1}
                precision={2}
                placeholder="3.0"
                value={tempFilters.initialInterestRateMin}
                onChange={(value) => handleTempFilterChange('initialInterestRateMin', value)}
                style={{ width: 80 }}
              />
              <p>~</p>
              <InputNumber
                min={3.0}
                max={12.0}
                step={0.1}
                precision={2}
                placeholder="12.0"
                value={tempFilters.initialInterestRateMax}
                onChange={(value) => handleTempFilterChange('initialInterestRateMax', value)}
                style={{ width: 80 }}
              />
            </FilterRow>

            <FilterRow>
              <FilterLabel>기존 대출 횟수</FilterLabel>
              <InputNumber
                min={0}
                max={100}
                placeholder="0"
                value={tempFilters.previousLoanCountMin}
                onChange={(value) => handleTempFilterChange('previousLoanCountMin', value)}
                style={{ width: 65 }}
              />
              <p>~</p>
              <InputNumber
                min={0}
                max={100}
                placeholder="100"
                value={tempFilters.previousLoanCountMax}
                onChange={(value) => handleTempFilterChange('previousLoanCountMax', value)}
                style={{ width: 65 }}
              />
            </FilterRow>

            <FilterRow>
              <FilterLabel>신규/연장/재가입</FilterLabel>
              <Select
                value={tempFilters.loanType}
                onChange={(value) => handleTempFilterChange('loanType', value)}
                options={[
                  { value: 'ALL', label: '전체' },
                  { value: 'NEW', label: '신규' },
                  { value: 'EXTENSION', label: '연장' },
                  { value: 'REDEVELOPMENT', label: '재가입' },
                ]}
                style={{ width: 100 }}
              />
            </FilterRow>
          </Space>

          <Button type="primary" onClick={handleSearchClick}>
            조회
          </Button>
        </Conditionbar>

        <DataTable
          loading={isLoading}
          columnMetas={[...LOAN_APPLICATION_COLUMN_METAS]}
          linkPrefix="/admin/customer-management/"
          data={tableData}
          paginationInfo={{
            currentPage: page,
            pageSize: data?.paginationInfo.pageSize || PAGE_SIZE,
            totalElements: data?.paginationInfo.totalElements || 0,
            totalPages: data?.paginationInfo.totalPages || 0,
            onChange: handlePageChange,
          }}
        />

        <LoanStatusChangeModal isOpen={isModalVisible} onOutsideClick={handleModalCancel}>
          <ModalColumnContainer>
            <ModalTitle>대출 상태 변경</ModalTitle>

            <ModalRowContainer>
              <ModalInfoContainer>
                <ModalInfoKeyColumn>
                  <InfoLabel>신청자:</InfoLabel>
                  <InfoLabel>현재 상태:</InfoLabel>
                </ModalInfoKeyColumn>

                <ModalInfoValueColumn>
                  <InfoValue>{displayValue(detail?.applicantName)}</InfoValue>
                  <InfoValue>
                    {displayValue(
                      detail?.applicationStatus ? STATUS_LABEL[detail.applicationStatus] : null
                    )}
                  </InfoValue>
                </ModalInfoValueColumn>
              </ModalInfoContainer>

              <ModalInfoContainer>
                <ModalInfoKeyColumn>
                  <InfoLabel>소비 성향:</InfoLabel>
                  <InfoLabel>소비 목표:</InfoLabel>
                </ModalInfoKeyColumn>

                <ModalInfoValueColumn>
                  <InfoValue>{displayValue(detail?.consumptionType)}</InfoValue>
                  <InfoValue>{displayValue(detail?.consumeGoal)}</InfoValue>
                </ModalInfoValueColumn>
              </ModalInfoContainer>
            </ModalRowContainer>
          </ModalColumnContainer>

          <ModalColumnContainer>
            <ModalSubTitle>대출 심사 결과</ModalSubTitle>

            <ModalRowContainer>
              <ModalInfoContainer>
                <ModalInfoKeyColumn>
                  <InfoLabel>대출 신청 일자:</InfoLabel>
                  <InfoLabel>금리 범위:</InfoLabel>
                  <InfoLabel>초기 대출 금리:</InfoLabel>
                  <InfoLabel>최근 금리:</InfoLabel>
                </ModalInfoKeyColumn>

                <ModalInfoValueColumn>
                  <InfoValue>
                    {displayValue(
                      detail?.appliedAt,
                      (v) => `${formatYMD({ dateString: v?.toString() })}`
                    )}
                  </InfoValue>
                  <InfoValue>
                    {displayValue(
                      detail?.interestRateMin !== undefined && detail?.interestRateMax !== undefined
                        ? `연 ${detail.interestRateMin}% ~ ${detail.interestRateMax}%`
                        : null
                    )}
                  </InfoValue>
                  <InfoValue>
                    {displayValue(detail?.initialInterestRate, (v) => `연 ${v}%`)}
                  </InfoValue>
                  <InfoValue>
                    {displayValue(detail?.lastInterestRate, (v) => {
                      if (v === 0) {
                        return `-`;
                      }
                      return `${Number(v)}% (최종 갱신 ${formatYMD({
                        dateString: detail?.lastInterestDate || undefined,
                      })})`;
                    })}
                  </InfoValue>
                </ModalInfoValueColumn>
              </ModalInfoContainer>

              <ModalInfoContainer>
                <ModalInfoKeyColumn>
                  <InfoLabel>대출 가능 한도:</InfoLabel>
                  <InfoLabel>요청 대출 금액:</InfoLabel>
                  <InfoLabel>요청 상환 기간:</InfoLabel>
                </ModalInfoKeyColumn>

                <ModalInfoValueColumn>
                  <InfoValue>
                    {displayValue(detail?.approvedMaxAmount, (v) => `${v?.toLocaleString()}원`)}
                  </InfoValue>
                  <InfoValue>
                    {displayValue(detail?.requestedAmount, (v) => `${v?.toLocaleString()}원`)}
                  </InfoValue>
                  <InfoValue>
                    {displayValue(detail?.repaymentMonths, (v) => {
                      const start = formatYMD(
                        detail?.repaymentStartDate
                          ? { dateString: detail.repaymentStartDate }
                          : undefined
                      );
                      const end = formatYMD(
                        detail?.repaymentEndDate
                          ? { dateString: detail.repaymentEndDate }
                          : undefined
                      );

                      if (start === '-' && end === '-') {
                        return `-`;
                      }
                      return `${start} ~ ${end} (${v}개월)`;
                    })}
                  </InfoValue>
                </ModalInfoValueColumn>
              </ModalInfoContainer>
            </ModalRowContainer>
          </ModalColumnContainer>

          <ModalColumnContainer>
            <ModalSubTitle>대출 신청 정보</ModalSubTitle>

            <ModalRowContainer>
              <ModalInfoContainer>
                <ModalInfoKeyColumn>
                  <InfoLabel>고용 형태:</InfoLabel>
                  <InfoLabel>연소득:</InfoLabel>
                  <InfoLabel>주거 형태:</InfoLabel>
                </ModalInfoKeyColumn>

                <ModalInfoValueColumn>
                  <InfoValue>
                    {displayValue(EMPLOYMENT_TYPE_LABEL[detail?.employmentType ?? 'ETC'])}
                  </InfoValue>
                  <InfoValue>
                    {displayValue(detail?.annualIncome, (v) => `${v?.toLocaleString()}원`)}
                  </InfoValue>
                  <InfoValue>
                    {displayValue(RESIDENCE_TYPE_LABEL[detail?.residenceType ?? 'MONTHLY'])}
                  </InfoValue>
                </ModalInfoValueColumn>
              </ModalInfoContainer>

              <ModalInfoContainer>
                <ModalInfoKeyColumn>
                  <InfoLabel>개인회생 여부:</InfoLabel>
                  <InfoLabel>대출 목적:</InfoLabel>
                </ModalInfoKeyColumn>

                <ModalInfoValueColumn>
                  <InfoValue>{BANKRUPT_LABEL(detail?.isBankrupt)}</InfoValue>
                  <InfoValue>
                    {displayValue(LOAN_PURPOSE_LABEL[detail?.loanPurpose ?? 'ETC'])}
                  </InfoValue>
                </ModalInfoValueColumn>
              </ModalInfoContainer>
            </ModalRowContainer>
          </ModalColumnContainer>

          {isChangeable ? (
            <>
              <DivideMargin />
              <SubContainer>
                <TextField
                  value={reason}
                  onChange={(v: string) => {
                    setReason(v);
                    if (reasonError) setReasonError('');
                  }}
                  isDisabled={false}
                >
                  <TextField.Label>변경 사유</TextField.Label>
                  <TextField.TextFieldBox placeholder="변경 사유 입력" />
                  {reasonError && <ErrorInfo>{reasonError}</ErrorInfo>}
                </TextField>
              </SubContainer>

              <FlexContainer>
                {detail?.applicationStatus === 'PRE_APPLIED' && (
                  <FlexrateButton
                    text="초기 상태로 변경"
                    varient="PRIMARY"
                    onClick={() => handleModalOk('NONE')}
                  />
                )}
                {detail?.applicationStatus === 'PENDING' && (
                  <>
                    <FlexrateButton
                      text="대출 거절"
                      varient="WARN"
                      onClick={() => handleModalOk('REJECTED')}
                    />
                    <FlexrateButton
                      text="대출 승인"
                      varient="PRIMARY"
                      onClick={() => handleModalOk('EXECUTED')}
                    />
                  </>
                )}
                {detail?.applicationStatus === 'EXECUTED' && (
                  <>
                    <FlexrateButton
                      text="대출 중도 취소"
                      varient="WARN"
                      onClick={() => handleModalOk('REJECTED')}
                    />
                    <FlexrateButton
                      text="상환 완료"
                      varient="PRIMARY"
                      onClick={() => handleModalOk('COMPLETED')}
                    />
                  </>
                )}
                {detail?.applicationStatus === 'COMPLETED' && (
                  <FlexrateButton
                    text="초기 상태로 변경"
                    varient="PRIMARY"
                    onClick={() => handleModalOk('NONE')}
                  />
                )}
                {detail?.applicationStatus === 'NONE' && (
                  <FlexrateButton
                    text="신청 접수중으로 변경"
                    varient="PRIMARY"
                    onClick={() => handleModalOk('PRE_APPLIED')}
                  />
                )}
                {detail?.applicationStatus === 'REJECTED' && (
                  <FlexrateButton
                    text="초기 상태로 변경"
                    varient="PRIMARY"
                    onClick={() => handleModalOk('NONE')}
                  />
                )}
              </FlexContainer>
            </>
          ) : (
            <InfoBottomText>변경 가능한 상태가 아닙니다</InfoBottomText>
          )}
        </LoanStatusChangeModal>
      </ContentColumn>
    </PageContainer>
  );
};

export default AdminLoanApplicationPage;
