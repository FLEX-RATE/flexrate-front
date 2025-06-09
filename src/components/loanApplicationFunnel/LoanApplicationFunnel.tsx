'use client';

import { useFunnel } from '@use-funnel/browser';
import { useRouter } from 'next/navigation';

import { useClearFunnelContext } from '@/hooks/useClearFunnelContext';
import { usePostLoanReviewApplication } from '@/hooks/useLoanApplication';
import { useResumeFunnel } from '@/hooks/useResumeFunnel';
import { useLoanFunnelStore } from '@/stores/LoanFunnelStore';
import { useUserStore } from '@/stores/userStore';

import Header from '../Header/Header';
import ProgressBar from '../ProgressBar/ProgressBar';

import { CreditStep } from './CreditStep/CreditStep';
import { JobStep } from './JobStep/JobStep';
import {
  Container,
  Description,
  HeaderContainer,
  JobFlexStartContainer,
  Name,
  Title,
  Wrapper,
} from './LoanApplicationFunnel.style';
import { PurposeStep } from './PurposeStep/PurposeStep';
import ReviewResultAndLoanApplication from './ReviewResultAndLoanApplication/ReviewResultAndLoanApplication';

export type FunnelContextMap = {
  직업정보입력: {
    employmentType: string;
  };
  신용정보입력: {
    annualIncome: number;
    creditGrade: string;
    residenceType: string;
    isBankrupt: boolean;
  };
  대출목적입력: {
    loanPurpose: string;
  };
  대출신청접수: {
    loanAmount: number;
    repaymentMonth: number;
  };
};

const LoanApplicationFunnel = () => {
  const user = useUserStore((state) => state.user);
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') ?? '' : '';
  const { funnelContext, setFunnelContext } = useLoanFunnelStore();
  const { mutate: applyReviewLoan } = usePostLoanReviewApplication(token);

  useClearFunnelContext();
  useResumeFunnel();

  const funnel = useFunnel<FunnelContextMap>({
    id: 'loan-application-funnel',
    initial: {
      step: '직업정보입력',
      context: {
        employmentType: '',
      },
    },
  });

  const steps: (keyof FunnelContextMap)[] = [
    '직업정보입력',
    '신용정보입력',
    '대출목적입력',
    '대출신청접수',
  ];

  const currentIndex = steps.findIndex((s) => s === funnel.step);
  const totalSteps = steps.length;

  const router = useRouter();

  return (
    <Wrapper>
      <HeaderContainer>
        <Header type="대출 신청" backIcon={true} />
        <ProgressBar totalSteps={totalSteps} currentStep={currentIndex + 1} />
      </HeaderContainer>
      <JobFlexStartContainer>
        {funnel.step !== '대출신청접수' ? (
          <>
            <Title>대출 심사 정보 입력</Title>
            <Description>
              대출 심사를 진행하기 위해 <br /> 본인의 신용 평가 정보를 기입해주세요
            </Description>
          </>
        ) : (
          <Title>
            <Name>{user?.username}</Name>님의 대출 심사 결과
          </Title>
        )}
      </JobFlexStartContainer>
      <Container>
        <funnel.Render
          직업정보입력={funnel.Render.with({
            render: () => (
              <JobStep
                value={funnelContext['직업정보입력'] ?? { employmentType: '' }}
                onChange={(ctx) => {
                  funnel.history.replace('직업정보입력', ctx);
                  setFunnelContext('직업정보입력', ctx);
                }}
                onNext={() =>
                  funnel.history.push('신용정보입력', (prev) => ({
                    ...prev,
                    annualIncome: 0,
                    creditGrade: '',
                    residenceType: '',
                    isBankrupt: false,
                  }))
                }
              />
            ),
          })}
          신용정보입력={funnel.Render.with({
            render: () => (
              <CreditStep
                value={
                  funnelContext['신용정보입력'] ?? {
                    annualIncome: 0,
                    creditGrade: '',
                    residenceType: '',
                    isBankrupt: false,
                  }
                }
                onChange={(ctx) => {
                  funnel.history.replace('신용정보입력', ctx);
                  setFunnelContext('신용정보입력', ctx);
                }}
                onNext={() =>
                  funnel.history.push('대출목적입력', (prev) => ({
                    ...prev,
                    loanPurpose: '',
                  }))
                }
              />
            ),
          })}
          대출목적입력={funnel.Render.with({
            render: () => (
              <PurposeStep
                value={funnelContext['대출목적입력'] ?? { loanPurpose: '' }}
                onChange={(ctx) => {
                  funnel.history.replace('대출목적입력', ctx);
                  setFunnelContext('대출목적입력', ctx);
                }}
                onSubmit={async () => {
                  const request = {
                    employmentType: funnelContext['직업정보입력']?.employmentType ?? '',
                    annualIncome: Number(funnelContext['신용정보입력']?.annualIncome ?? 0),
                    residenceType: funnelContext['신용정보입력']?.residenceType ?? '',
                    isBankrupt: funnelContext['신용정보입력']?.isBankrupt ?? false,
                    loanPurpose: funnelContext['대출목적입력']?.loanPurpose ?? '',
                  };

                  applyReviewLoan(request, {
                    onSuccess: () => {
                      funnel.history.push('대출신청접수', {
                        loanAmount: 0,
                        repaymentMonth: 1,
                      });
                    },
                    onError: (err) => {
                      console.error('대출 심사 실패', err);
                      alert('대출 심사 신청 중 오류가 발생했습니다.');
                    },
                  });
                }}
              />
            ),
          })}
          대출신청접수={funnel.Render.with({
            render: () => (
              <ReviewResultAndLoanApplication
                value={
                  funnelContext['대출신청접수'] ?? {
                    loanAmount: 0,
                    repaymentMonth: 1,
                  }
                }
                onChange={(ctx) => {
                  funnel.history.replace('대출신청접수', ctx);
                  setFunnelContext('대출신청접수', ctx);
                }}
                onSubmit={() => {
                  router.push('/pin/verify');
                }}
              />
            ),
          })}
        />
      </Container>
    </Wrapper>
  );
};

export default LoanApplicationFunnel;
