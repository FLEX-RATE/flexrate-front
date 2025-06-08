'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Wrapper,
  MainContainer,
  SubContainer,
  SubTitle,
  TableItem,
  TableItemKey,
  TableItemValue,
  BtnContainer,
  TitleContainer,
  Title,
  SubText,
  ModalBtnContainer,
} from '@/app/mypage/page.style';
import Banner from '@/components/Banner/Banner';
import Button from '@/components/Button/Button';
import Header from '@/components/Header/Header';
import { Container } from '@/components/loanApplicationFunnel/LoanApplicationFunnel.style';
import Modal from '@/components/Modal/Modal';
import MyPageSkeleton from '@/components/skeletons/MypageSkeleton';
import { useInitUser } from '@/hooks/useInitUser';
import { useLogout } from '@/hooks/useLogout';
import { useUserStore } from '@/stores/userStore';

const MyPage = () => {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { mutate: logoutMutate } = useLogout();
  const token = useUserStore((state) => state.accessToken);

  console.log(token);

  const handleClick = () => {
    router.push('/mypage/edit');
  };

  useEffect(() => {
    if (!token) {
      router.replace('/not-found');
    }
  }, [router]);

  useInitUser();
  const user = useUserStore((state) => state.user);
  const hydrated = useUserStore((state) => state._hasHydrated);

  const handleLogout = () => {
    logoutMutate();
  };

  if (!hydrated) return <MyPageSkeleton />;

  return (
    <Wrapper>
      <Header
        type="마이페이지"
        backIcon={true}
        onClickBackIcon={() => router.push('/')}
        isLoggedIn={!!user}
        onLogoutClick={() => setIsLogoutModalOpen(true)}
      />

      <Container>
        <MainContainer>
          <SubContainer>
            <SubTitle>개인 정보</SubTitle>

            <TableItem>
              <TableItemKey>이름</TableItemKey>
              <TableItemValue>{user?.username}</TableItemValue>
            </TableItem>
            <TableItem>
              <TableItemKey>이메일</TableItemKey>
              <TableItemValue>{user?.email}</TableItemValue>
            </TableItem>
          </SubContainer>

          <SubContainer>
            <SubTitle>소비 성향</SubTitle>
            <Banner type={user?.consumptionType} />
          </SubContainer>
        </MainContainer>

        <BtnContainer>
          <Button text="정보 변경하기" onClick={handleClick} />
        </BtnContainer>
      </Container>
      <Modal type="LOGOUT" isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)}>
        <TitleContainer>
          <Title>로그아웃</Title>
          <SubText>flexrate에서 로그아웃 하시겠어요?</SubText>
        </TitleContainer>
        <ModalBtnContainer>
          <Button text="돌아가기" varient="TERTIARY" onClick={() => setIsLogoutModalOpen(false)} />
          <Button text="로그아웃하기" varient="PRIMARY" onClick={handleLogout} />
        </ModalBtnContainer>
      </Modal>
    </Wrapper>
  );
};

export default MyPage;
