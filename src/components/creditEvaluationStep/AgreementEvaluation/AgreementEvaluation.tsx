'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import Button from '@/components/Button/Button';
import CircularChart from '@/components/CircularChart/CircularChart';
import { Container, Title } from '@/components/loanApplicationFunnel/LoanApplicationFunnel.style';
import { Description } from '@/components/loanApplicationFunnel/ReviewResultAndLoanApplication/ReviewResultAndLoanApplication.style';
import { useCreditScoreEvaluate } from '@/hooks/useCreditScore';
import { useSelectLoanProduct } from '@/hooks/useSelectLoanProduct';
import { useUserStore } from '@/stores/userStore';

import { BtnContainer, TextContainer, Wrapper } from './AgreementEvaluation.style';

const PRODUCT_ID = 1;

const AgreementEvaluation = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { mutate } = useSelectLoanProduct();

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const { data: creditResult } = useCreditScoreEvaluate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (
      user &&
      creditResult?.creditScore != null &&
      user.creditScore !== creditResult.creditScore
    ) {
      setUser({
        ...user,
        creditScore: creditResult.creditScore,
      });
    }
  }, [user, creditResult?.creditScore, setUser]);

  return (
    <Wrapper>
      <Container>
        <CircularChart
          loading={loading}
          score={creditResult?.creditScore ?? 0}
          rank={creditResult?.percentile ?? 0}
        />
        {!loading && (
          <>
            <TextContainer>
              <Title>{`${user?.username}님의 신용 점수를 산출했어요`}</Title>
              <Description>이제 대출 신청이 가능해요</Description>
            </TextContainer>
            <BtnContainer>
              <Button
                text="메인페이지로 이동"
                varient="TERTIARY"
                onClick={() => router.push('/')}
              />
              {user?.recentLoanStatus !== 'EXECUTED' && (
                <Button
                  text="대출 신청하기"
                  varient="PRIMARY"
                  onClick={() => {
                    if (user?.recentLoanStatus === 'NONE') {
                      mutate(PRODUCT_ID);
                    }
                    router.push('/loan-application');
                  }}
                />
              )}
            </BtnContainer>
          </>
        )}
      </Container>
    </Wrapper>
  );
};

export default AgreementEvaluation;
