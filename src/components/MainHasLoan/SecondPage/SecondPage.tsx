import LoanDashboard from '@/components/main/LoanDashboard/LoanDashboard';
import { useMainFirstPage } from '@/hooks/useMainFirstPage';
import { useMainSecondPage } from '@/hooks/useMainSecondPage';
import { splitYMD } from '@/utils/dateFormat';

import {
  BgContainer,
  Card,
  CardContentContainer,
  CardTitle,
  Description,
  SmallTitle,
  SubTitle,
  Wrapper,
} from '../FirstPage/FirstPage.style';

import {
  CardFlexContainer,
  GridContainer,
  MediumTitle,
  MediumTitleWrapper,
} from './SecondPage.style';

const SecondPage = () => {
  const { interestCurrent } = useMainFirstPage();
  const { mainData } = useMainSecondPage();
  const nextDate = mainData?.nextPaymentDate
    ? new Date(mainData.nextPaymentDate).toISOString().slice(0, 10)
    : undefined;

  const {
    year: nextRepaymentYear,
    month: nextRepaymentMonth,
    day: nextRepaymentDay,
  } = splitYMD({ dateString: nextDate });

  const {
    year: startYear,
    month: startMonth,
    day: startDay,
  } = splitYMD({ dateString: mainData?.startDate });

  const recentDateFormatted = mainData?.recentRepaymentDate
    ? new Date(mainData.recentRepaymentDate).toISOString().slice(0, 10).replace(/-/g, '.')
    : '-';

  return (
    mainData && (
      <Wrapper>
        <BgContainer color="white">
          <LoanDashboard mainData={mainData} currentRate={interestCurrent?.currentRate ?? 0} />
          <CardFlexContainer>
            <Card color="gray">
              <MediumTitleWrapper>
                <MediumTitle $isStrong={true}>
                  {nextRepaymentYear}
                  <MediumTitle>년</MediumTitle>
                </MediumTitle>
                <br />
                <MediumTitle $isStrong={true}>
                  {nextRepaymentMonth}
                  <MediumTitle>월</MediumTitle>
                </MediumTitle>
                <MediumTitle $isStrong={true}>
                  {nextRepaymentDay}
                  <MediumTitle>일</MediumTitle>
                </MediumTitle>
              </MediumTitleWrapper>
              <CardContentContainer>
                <SubTitle>
                  이번 달<br />
                  대출금 상환 일자
                </SubTitle>
              </CardContentContainer>
            </Card>
            <Card color="gray">
              <CardTitle>
                0<SmallTitle>회차</SmallTitle>
              </CardTitle>
              <CardContentContainer>
                <SubTitle>대출금 납부 회차</SubTitle>
                <Description type="sub2">{recentDateFormatted}</Description>
              </CardContentContainer>
            </Card>
          </CardFlexContainer>
        </BgContainer>
        <BgContainer color="gray">
          <GridContainer>
            <Card>
              <MediumTitleWrapper>
                <MediumTitle $isStrong={true}>
                  {startYear}
                  <MediumTitle>년</MediumTitle>
                </MediumTitle>
                <br />
                <MediumTitle $isStrong={true}>
                  {startMonth}
                  <MediumTitle>월</MediumTitle>
                </MediumTitle>
                <MediumTitle $isStrong={true}>
                  {startDay}
                  <MediumTitle>일</MediumTitle>
                </MediumTitle>
              </MediumTitleWrapper>
              <CardContentContainer>
                <SubTitle>대출 시작일</SubTitle>
              </CardContentContainer>
            </Card>
            <Card>
              <CardTitle>
                {mainData?.loanRepaymentTransactionNum}
                <SmallTitle>회차</SmallTitle>
              </CardTitle>
              <CardContentContainer>
                <SubTitle>금리 변경 횟수</SubTitle>
              </CardContentContainer>
            </Card>
          </GridContainer>
        </BgContainer>
      </Wrapper>
    )
  );
};

export default SecondPage;
