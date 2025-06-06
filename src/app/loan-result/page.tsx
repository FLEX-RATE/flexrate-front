'use client';

import { useEffect } from 'react';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';

import Button from '@/components/Button/Button';
import Header from '@/components/Header/Header';
import {
  Container,
  Description,
  Title,
  Wrapper,
} from '@/components/loanApplicationFunnel/LoanApplicationFunnel.style';
import { ExecutedResult } from '@/components/loanResult/ExecutedResult/ExecutedResult';
import { loanStatusMap } from '@/constants/loan.constant';
import { useGetLoanApplication } from '@/hooks/useLoanApplication';
import { useLoanStatus } from '@/hooks/useLoanStatus';
import { useSelectLoanProduct } from '@/hooks/useSelectLoanProduct';
import { useUserStore } from '@/stores/userStore';
import { LoanStatusType } from '@/types/user.type';

const LoanResult = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') ?? '' : '';
  const router = useRouter();
  const { data: result } = useGetLoanApplication(token);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { mutate } = useSelectLoanProduct();
  const { data: updateLoanStatus } = useLoanStatus();

  useEffect(() => {
    if (user) {
      const newUser = { ...user };

      if (updateLoanStatus) {
        newUser.recentLoanStatus = updateLoanStatus as LoanStatusType;
      } else if (result?.loanApplicationResult) {
        newUser.recentLoanStatus = result.loanApplicationResult as LoanStatusType;
      }

      setUser(newUser);
    }
  }, [updateLoanStatus, result, setUser]);

  if (!result) return null;

  const loanStatus = result.loanApplicationResult as LoanStatusType;
  const title = loanStatusMap[loanStatus]?.title ?? '';
  const description = loanStatusMap[loanStatus]?.description ?? '';

  const handleRetryLoanApply = () => {
    mutate(1);
    localStorage.removeItem('loan-funnel-context');
    router.push('/loan-application');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <Wrapper>
      <Header type="대출 신청" isLoggedIn={!!user} />
      <Container>
        <TitleContainer>
          <Title>{title}</Title>
          {description.split('\n').map((line: string, idx: number) => (
            <Description key={idx}>
              {line}
              <br />
            </Description>
          ))}
        </TitleContainer>
        {loanStatus === 'EXECUTED' && <ExecutedResult result={result} />}
        <BtnContainer>
          {loanStatus === 'REJECTED' && (
            <Button varient="SECONDARY" text="재신청하기" onClick={handleRetryLoanApply} />
          )}
          <Button text="메인페이지로 이동" onClick={handleBack} />
        </BtnContainer>
      </Container>
    </Wrapper>
  );
};

export default LoanResult;

const TitleContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 11px 0px 0px 11px;
`;

const BtnContainer = styled.div`
  display: flex;
  gap: 8px;
  width: calc(100% - 44px);
  position: absolute;
  bottom: 0;
  margin-bottom: 50px;
`;
