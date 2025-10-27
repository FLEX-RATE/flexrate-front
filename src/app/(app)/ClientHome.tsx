'use client';
import styled from '@emotion/styled';

import Header from '@/components/Header/Header';
import IntroduceHome from '@/components/main/IntroduceHome/IntroduceHome';
import TabBar from '@/components/main/TabBar/TabBar';
import MainHasLoan from '@/components/MainHasLoan/MainHasLoan';
import { useMe } from '@/hooks/useMe';

import MeStoreBridge from './_components/MeStoreBridge';

const ClientHome = () => {
  const { data: me, isLoading } = useMe();

  if (isLoading) return <Container aria-busy="true" />;

  return (
    <Container>
      <MeStoreBridge />
      <Header type="우리금융그룹" isLoggedIn={!!me} hasLoan={me?.recentLoanStatus === 'EXECUTED'} />
      <TabBar />
      {!!me && me.recentLoanStatus === 'EXECUTED' ? <MainHasLoan /> : <IntroduceHome />}
    </Container>
  );
};

export default ClientHome;

const Container = styled.div`
  min-height: 100svh;
  overflow-y: auto;
`;
