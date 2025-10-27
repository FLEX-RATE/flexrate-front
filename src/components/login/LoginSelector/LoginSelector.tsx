'use client';
import React from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import BottomSheet from '@/components/BottomSheet/BottomSheet';

import {
  BottomSheetHeaderContainer,
  BtnContainer,
  BtnWrapper,
  Container,
  Question,
  SheetBtn,
  SubText,
  Title,
} from './LoginSelector.style';

type LoginSelectorProps = {
  onSelectPassword: () => void;
  // onSelectFace?: () => void;
};

const LoginSelector = ({ onSelectPassword }: LoginSelectorProps) => {
  const router = useRouter();

  const handleSelectPin = () => {
    alert('간편 비밀번호 기능은 현재 개발 중입니다.');
  };

  const handleGoSignup = () => {
    router.push('/auth/signup');
  };

  return (
    <Container>
      <Title>
        반가워요!
        <br />
        로그인을 진행할게요
      </Title>
      <BottomSheet isOpen={true}>
        <BottomSheetHeaderContainer>
          <Question>어떤 방법으로 로그인할까요?</Question>
          <SubText onClick={handleGoSignup}>회원가입</SubText>
        </BottomSheetHeaderContainer>
        <BtnWrapper>
          {/* <SheetBtn onClick={handleSelectPin}>
            <BtnContainer>
              <Image src={'/imgs/lock.svg'} width={36} height={36} alt="간편 비밀번호" />
              간편 비밀번호
            </BtnContainer>
          </SheetBtn> */}

          <SheetBtn onClick={onSelectPassword}>
            <BtnContainer>
              <Image src={'/icons/webee_36.svg'} width={36} height={36} alt="일반 로그인" />
              일반 로그인
            </BtnContainer>
          </SheetBtn>
        </BtnWrapper>
      </BottomSheet>
    </Container>
  );
};

export default LoginSelector;
