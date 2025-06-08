'use client';

import styled from '@emotion/styled';

// import CharacterLoading from '@/components/CharacterLoading/CharacterLoading';
import Header from '@/components/Header/Header';
import IntroduceHome from '@/components/main/IntroduceHome/IntroduceHome';
import TabBar from '@/components/main/TabBar/TabBar';
import MainHasLoan from '@/components/MainHasLoan/MainHasLoan';
import MainFirstPageSkeleton from '@/components/skeletons/MainFirstPageSkeleton';
import { useUserStore } from '@/stores/userStore';

const Home = () => {
  const user = useUserStore((state) => state.user);
  const hydrated = useUserStore((s) => s._hasHydrated);
  const isLoggedIn = !!user;
  const hasLoan = user?.recentLoanStatus === 'EXECUTED';

  if (!hydrated) return <MainFirstPageSkeleton />;

  return (
    <Container>
      <Header type="우리금융그룹" isLoggedIn={isLoggedIn} hasLoan={hasLoan} />
      <TabBar />
      {user && hasLoan ? <MainHasLoan /> : <IntroduceHome />}
    </Container>
  );
};

export default Home;

const Container = styled.div`
  height: 100svh;
  overflow-y: auto;
`;
