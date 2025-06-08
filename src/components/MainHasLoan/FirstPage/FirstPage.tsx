'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useMainFirstPage } from '@/hooks/useMainFirstPage';
import { useMainSecondPage } from '@/hooks/useMainSecondPage';
import { User, useUserStore } from '@/stores/userStore';
import { formatKoreanMoneyUnit } from '@/utils/formatKoreanMoneyUnit';

import {
  BgContainer,
  Body2,
  Body3,
  Card,
  CardContentContainer,
  CardFlexContainer,
  CardTitle,
  Description,
  FlexContainer,
  MainTitleContainer,
  PercentageText,
  ProductTitle,
  SmallTag,
  SmallTitle,
  SubTitle,
  Tags,
  Title2,
  UserProductContainer,
  UserProductContentContainer,
  Wrapper,
} from './FirstPage.style';

const AreaChart = dynamic(() => import('@/components/AreaChart/AreaChart'), {
  ssr: false,
  loading: () => <div style={{ height: '200px' }} />,
});

const Banner = dynamic(() => import('@/components/Banner/Banner'), {
  ssr: false,
});

const FirstPage = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const hydrated = useUserStore((s) => s._hasHydrated);
  const { interestCurrent, creditScore } = useMainFirstPage();
  const { mainData } = useMainSecondPage();

  const fallbackName = '고객님';
  const fallbackAmount = '0원';

  const isServer = typeof window === 'undefined';
  const displayName = isServer ? fallbackName : user?.username ?? fallbackName;
  return (
    <Wrapper>
      <BgContainer color="white">
        <MainTitleContainer>
          <Title2 as="div" suppressHydrationWarning>
            {typeof window === 'undefined'
              ? fallbackName + '님'
              : `${user?.username ?? fallbackName}님`}
          </Title2>

          <Body2 suppressHydrationWarning>
            현재{' '}
            <Body3 suppressHydrationWarning>
              {typeof window === 'undefined'
                ? fallbackAmount
                : mainData?.totalAmount != null
                ? formatKoreanMoneyUnit(mainData.totalAmount)
                : fallbackAmount}
            </Body3>{' '}
            대출 상품을 이용 중입니다.
          </Body2>
        </MainTitleContainer>

        <UserProductContainer>
          <ProductTitle>나의 대출 상품</ProductTitle>
          <UserProductContentContainer>
            <Title2 isStrong={true}>
              Flexrate<Title2>신용대출</Title2>
            </Title2>
            <Tags>
              <SmallTag>{mainData?.repaymentMonth ?? '-'}개월</SmallTag>
              <SmallTag>
                {mainData?.totalAmount != null
                  ? formatKoreanMoneyUnit(mainData.totalAmount)
                  : fallbackAmount}
              </SmallTag>
            </Tags>
          </UserProductContentContainer>
        </UserProductContainer>
      </BgContainer>

      <BgContainer color="gray">
        <Banner type={user?.consumptionType} borderNone={true} isWithReport={true} />
        <AreaChart />
        <CardFlexContainer>
          <Card>
            <CardTitle>
              {interestCurrent?.currentRate}
              <SmallTitle>%</SmallTitle>
            </CardTitle>
            <CardContentContainer>
              <SubTitle>오늘의 대출금리</SubTitle>
              <FlexContainer>
                <Description type="sub2">어제 대비</Description>
                <Image
                  src="/icons/greenUpArrow.svg"
                  alt="위 화살표"
                  width={18}
                  height={18}
                  priority
                />
                <PercentageText>{interestCurrent?.changeRatePercent.toFixed(2)}%</PercentageText>
              </FlexContainer>
            </CardContentContainer>
          </Card>

          <Card>
            <CardTitle>
              {creditScore?.creditScore}
              <SmallTitle>점</SmallTitle>
            </CardTitle>
            <CardContentContainer>
              <SubTitle>신용 평가 점수</SubTitle>
              <Description type="sub2" onClick={() => router.push('/credit-evaluation')}>
                평가 다시 받기 -&gt;
              </Description>
            </CardContentContainer>
          </Card>
        </CardFlexContainer>
      </BgContainer>
    </Wrapper>
  );
};

export default FirstPage;
