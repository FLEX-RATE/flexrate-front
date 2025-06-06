import Image from 'next/image';
import { useRouter } from 'next/navigation';

import AreaChart from '@/components/AreaChart/AreaChart';
import Banner from '@/components/Banner/Banner';
import { useMainFirstPage } from '@/hooks/useMainFirstPage';
import { useMainSecondPage } from '@/hooks/useMainSecondPage';
import { User } from '@/stores/userStore';
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

const FirstPage = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const { interestCurrent, creditScore } = useMainFirstPage();
  const { mainData } = useMainSecondPage();

  const totalAmount =
    mainData?.totalAmount != null ? formatKoreanMoneyUnit(mainData.totalAmount) : '-';

  return (
    <Wrapper>
      <BgContainer color="white">
        <MainTitleContainer>
          <Title2>{user?.username}님,</Title2>
          <Body2>
            현재 <Body3>{totalAmount}</Body3> 대출 상품을 이용 중입니다.
          </Body2>
        </MainTitleContainer>
        <UserProductContainer>
          <ProductTitle>나의 대출 상품</ProductTitle>
          <UserProductContentContainer>
            <Title2 isStrong={true}>
              Flexrate<Title2>신용대출</Title2>
            </Title2>
            <Tags>
              <SmallTag>{mainData?.repaymentMonth}개월</SmallTag>
              <SmallTag>{totalAmount}</SmallTag>
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
                <Image src={'/icons/greenUpArrow.svg'} alt="위 화살표" width={18} height={18} />
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
                평가 다시 받기
                <Image
                  src={'/icons/right_slide_arrow.svg'}
                  width={8}
                  height={8}
                  alt="신용 점수 평가 받기"
                />
              </Description>
            </CardContentContainer>
          </Card>
        </CardFlexContainer>
      </BgContainer>
    </Wrapper>
  );
};

export default FirstPage;
