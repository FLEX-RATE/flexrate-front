'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import Banner from '@/components/Banner/Banner';
import Button from '@/components/Button/Button';
import Header from '@/components/Header/Header';
import { Container } from '@/components/loanApplicationFunnel/LoanApplicationFunnel.style';
import Modal from '@/components/Modal/Modal';
import { useLogout } from '@/hooks/useLogout';
import { useUserStore, User } from '@/stores/userStore';

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
} from './page.style';

const MypageClient = ({ initialUser }: { initialUser: User }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { mutate: logoutMutate } = useLogout();

  const setUser = useUserStore((s) => s.setUser);
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    setUser(initialUser);
  }, []);

  const effectiveUser = user ?? initialUser;

  return (
    <Wrapper>
      <Header
        type="마이페이지"
        backIcon
        onClickBackIcon={() => router.push('/')}
        isLoggedIn={!!effectiveUser}
        onLogoutClick={() => setOpen(true)}
      />
      <Container>
        <MainContainer>
          <SubContainer>
            <SubTitle>개인 정보</SubTitle>
            <TableItem>
              <TableItemKey>이름</TableItemKey>
              <TableItemValue>{effectiveUser.username}</TableItemValue>
            </TableItem>
            <TableItem>
              <TableItemKey>이메일</TableItemKey>
              <TableItemValue>{effectiveUser.email}</TableItemValue>
            </TableItem>
          </SubContainer>
          <SubContainer>
            <SubTitle>소비 성향</SubTitle>
            <Banner type={effectiveUser.consumptionType} />
          </SubContainer>
        </MainContainer>
        <BtnContainer>
          <Button text="정보 변경하기" onClick={() => router.push('/mypage/edit')} />
        </BtnContainer>
      </Container>

      <Modal type="LOGOUT" isOpen={open} onClose={() => setOpen(false)}>
        <TitleContainer>
          <Title>로그아웃</Title>
          <SubText>flexrate에서 로그아웃 하시겠어요?</SubText>
        </TitleContainer>
        <ModalBtnContainer>
          <Button text="돌아가기" varient="TERTIARY" onClick={() => setOpen(false)} />
          <Button text="로그아웃하기" varient="PRIMARY" onClick={() => logoutMutate()} />
        </ModalBtnContainer>
      </Modal>
    </Wrapper>
  );
};

export default MypageClient;
