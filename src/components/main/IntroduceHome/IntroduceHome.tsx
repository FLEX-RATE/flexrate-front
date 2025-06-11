'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import {
  ModalBtnContainer,
  ModalSubTitle,
  ModalTitle,
  TitleContainer,
} from '@/components/Modal/Modal.style';
import { useCreditStatus } from '@/hooks/useCreditScore';
import { useLoanStatus } from '@/hooks/useLoanStatus';
import { useSelectLoanProduct } from '@/hooks/useSelectLoanProduct';
import { useUserStore } from '@/stores/userStore';

import {
  BtnContainer,
  Content,
  ContentBox,
  ContentSubTextContainer,
  ContentSubTextContent,
  ContentSubTextTitle,
  ContentTitle,
  Icon3DContainer,
  IntroduceContentContainer,
  IntroduceTextContainer,
  MainImage3D,
  Spacing,
  SubTitle,
  Title,
  Wrapper,
} from './IntroduceHome.style';

const PRODUCT_ID = 1; // 임시 상품 ID

const IntroduceHome = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const { mutate } = useSelectLoanProduct();
  const router = useRouter();

  const isLoggedIn = !!user;
  const [modalType, setModalType] = useState<'NONE_CREDIT' | 'PRE_APPLIED' | null>(null);

  const { data: creditData, isSuccess: creditSuccess } = useCreditStatus();
  const { data: loanStatusData, isSuccess: loanSuccess } = useLoanStatus();

  useEffect(() => {
    if (creditSuccess && loanSuccess && user) {
      setUser({
        ...user,
        hasCreditScore: creditData.creditScoreStatus,
        recentLoanStatus: loanStatusData,
      });
    }
  }, [creditData, loanStatusData]);

  const handleLoanApplyClick = () => {
    if (!isLoggedIn) {
      router.push('/auth/login');
    } else if (!user?.hasCreditScore) {
      setModalType('NONE_CREDIT');
    } else if (user?.recentLoanStatus === 'NONE') {
      mutate(PRODUCT_ID);
      router.push('/loan-application');
    } else if (user?.recentLoanStatus === 'PRE_APPLIED') {
      setModalType('PRE_APPLIED');
    } else {
      router.push('/loan-result');
    }
  };

  return (
    <Wrapper data-testid="introduce-home">
      <IntroduceContentContainer>
        <IntroduceTextContainer>
          <Title>FlexRate</Title>
          <SubTitle>당신의 라이프스타일로 평가받는 신용대출</SubTitle>
          <SubTitle>지금 FlexRate로 시작하세요!</SubTitle>
        </IntroduceTextContainer>

        <Icon3DContainer>
          <MainImage3D
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image src="/imgs/mainImage.svg" alt="대출 상품 이미지" width={169} height={169} />
          </MainImage3D>
        </Icon3DContainer>

        <ContentBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Content>
            <ContentTitle>최고금리</ContentTitle>
            <ContentSubTextContainer>
              <ContentSubTextTitle>연 2.6%</ContentSubTextTitle>
              <ContentSubTextContent>(개인, 세전, 금액 구간 별 최고 기준)</ContentSubTextContent>
            </ContentSubTextContainer>
          </Content>
          <Content>
            <ContentTitle>가입기간</ContentTitle>
            <ContentSubTextTitle>1일 ~ 365일</ContentSubTextTitle>
          </Content>
          <Content>
            <ContentTitle>가입금액</ContentTitle>
            <ContentSubTextTitle>제한 없음</ContentSubTextTitle>
          </Content>
        </ContentBox>
      </IntroduceContentContainer>

      <Spacing />
      <BtnContainer>
        <Button size="XL" text="대출 신청하기" varient="PRIMARY" onClick={handleLoanApplyClick} />
      </BtnContainer>

      <Modal isOpen={!!modalType} type={modalType!} onClose={() => setModalType(null)}>
        {modalType === 'PRE_APPLIED' && (
          <>
            <TitleContainer>
              <ModalTitle>신청 중인 대출이 있어요</ModalTitle>
              <ModalSubTitle>
                이전에 신청 중이던 대출이 있어요
                <br />
                새로 신청할까요?
              </ModalSubTitle>
            </TitleContainer>
            <ModalBtnContainer>
              <Button
                size="M"
                text="안할래요"
                varient="TERTIARY"
                onClick={() => {
                  setModalType(null);
                }}
              />
              <Button
                text="새로 신청할게요"
                varient="PRIMARY"
                onClick={() => {
                  setModalType(null);
                  router.push('/loan-application');
                }}
              />
            </ModalBtnContainer>
          </>
        )}

        {modalType === 'NONE_CREDIT' && (
          <>
            <TitleContainer>
              <ModalTitle>
                아직 신용 점수를
                <br />
                한번도 평가 받지 않았어요
              </ModalTitle>
              <ModalSubTitle>대출 신청 전에 신용 점수를 평가 받아야해요</ModalSubTitle>
            </TitleContainer>
            <ModalBtnContainer>
              <Button
                text="신용 점수 평가받기"
                varient="WARN"
                onClick={() => {
                  setModalType(null);
                  router.push('/credit-evaluation');
                }}
              />
            </ModalBtnContainer>
          </>
        )}
      </Modal>
    </Wrapper>
  );
};

export default IntroduceHome;
