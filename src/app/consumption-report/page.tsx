'use client';

import { useEffect, useMemo, useState } from 'react';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import BottomSheet from '@/components/BottomSheet/BottomSheet';
import Button from '@/components/Button/Button';
import Header from '@/components/Header/Header';
import {
  Description,
  Title,
  Wrapper,
} from '@/components/loanApplicationFunnel/LoanApplicationFunnel.style';
import { BtnContainer } from '@/components/signup/EmailForm/EmailForm.style';
import {
  useAvailableConsumptionMonth,
  useConsumptionReport,
  useConsumptionStatistic,
} from '@/hooks/useConsumptionReport';
import { useUserStore } from '@/stores/userStore';
import { primitiveColor, semanticColor } from '@/styles/colors';
import { typoStyleMap } from '@/styles/typos';
import { categoryMap, stats } from '@/types/consumption.type';
import { useDelayedLoading } from '@/hooks/useDelayLoading';
import CharacterLoading from '@/components/CharacterLoading/CharacterLoading';

const getTopStats = (stats: stats[]) => {
  if (!stats || stats.length === 0) return [];
  return stats.sort((a, b) => b.percentage - a.percentage).slice(0, 3);
};

const getCircleSize = (percentage: number, max: number) => {
  const maxSize = 200;
  const minSize = 90;
  return (percentage / max) * (maxSize - minSize) + minSize;
};

const getCircleStyle = (size: number, index: number) => {
  return {
    rotate: index === 1 ? -20 : size >= 180 ? 10 : size >= 160 ? -10 : 10,
    bgColor:
      index === 1
        ? primitiveColor.blue[100]
        : size >= 180
        ? semanticColor.bg.primary
        : primitiveColor.blue[700],
    color: index !== 1 ? semanticColor.text.normal.onPrimary : semanticColor.text.normal.accent,
    zIndex: size >= 180 ? 2 : size >= 160 ? 1 : 0,
  };
};

const circleLayouts = [
  { top: 30, left: 120 },
  { top: 160, left: 10 },
  { top: 230, left: 380 },
];

const ConsumptionReport = () => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') ?? '' : '';

  const { data: monthsData, isLoading: isLoadingMonths } = useAvailableConsumptionMonth(token);
  const months = useMemo(() => {
    return monthsData ? [...monthsData].sort((a, b) => (a > b ? -1 : 1)) : [];
  }, [monthsData]);

  const initialDate = useMemo(() => {
    if (!months || months.length === 0) return null;
    const [year, month] = months[0].split('-');
    return { year, month };
  }, [months]);

  const [selectedDate, setSelectedDate] = useState<{ year: string; month: string } | null>(null);

  useEffect(() => {
    if (initialDate && !selectedDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate, selectedDate]);

  const yearMonth =
    selectedDate && selectedDate.year && selectedDate.month
      ? `${selectedDate.year}-${selectedDate.month}`
      : '';

  const { data: reports, isLoading: isLoadingReports } = useConsumptionReport(token, yearMonth);
  const { data: statistic, isLoading: isLoadingStats } = useConsumptionStatistic(token, yearMonth);

  const isLoading = isLoadingMonths || isLoadingReports || isLoadingStats;
  const showSkeleton = useDelayedLoading(isLoading, 1000);

  if (showSkeleton || isLoading) return <CharacterLoading />;

  const handleDateModal = () => {
    setIsDateModalOpen(!isDateModalOpen);
  };

  if (!selectedDate || !reports || !statistic) return null;

  const topStats = getTopStats(statistic.stats);

  return (
    <Wrapper>
      <Header type="소비 습관 리포트" isLoggedIn={!!user} />
      <Container>
        <DateContainer onClick={() => handleDateModal()}>
          <Image src={'/icons/left_slide_arrow.svg'} width={14} height={14} alt="왼쪽 화살표" />
          {selectedDate.year}년 {selectedDate.month}월
          <Image src={'/icons/right_slide_arrow.svg'} width={14} height={14} alt="오른쪽 화살표" />
        </DateContainer>

        <Title>카테고리별 소비 통계</Title>
        <Description>
          최근 소비 패턴을 분석해,
          <br />더 나은 금융 습관을 제안합니다
        </Description>

        <CircleWrapper>
          <CircleContainer key={yearMonth}>
            {topStats.map((stat, index) => {
              const delay = index * 0.2;
              const size = getCircleSize(stat.percentage, topStats[0].percentage);
              const { top, left } = circleLayouts[index];
              const style = getCircleStyle(size, index);

              return (
                <StyledCircle
                  key={stat.category}
                  size={size}
                  top={Math.min(top, 365 - size)}
                  left={Math.min(left, 332 - size)}
                  $rotate={style.rotate}
                  $zIndex={style.zIndex}
                  $bgColor={style.bgColor}
                  $color={style.color}
                  initial={{
                    y: -200,
                    opacity: 0,
                    scale: 0.95,
                    rotate: style.rotate,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    rotate: style.rotate,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 12,
                    mass: 1.7,
                    delay,
                  }}
                >
                  <Percentage>{stat.percentage}%</Percentage>
                  <Category>{categoryMap[stat.category]}</Category>
                  <Account>{stat.amount.toLocaleString()}원</Account>
                </StyledCircle>
              );
            })}
          </CircleContainer>
        </CircleWrapper>

        <ReportContainer>
          <Title>소비 분석 개선 리포트</Title>
          <Description>{reports[0].summary}</Description>
        </ReportContainer>

        <BtnContainer>
          <Button size="XL" text="메인 페이지로 이동" onClick={() => router.push('/')} />
        </BtnContainer>
      </Container>

      <BottomSheet isOpen={isDateModalOpen} onClose={() => setIsDateModalOpen(false)}>
        <BottonSheetTitle>월 선택하기</BottonSheetTitle>
        <BottonSheetContent>
          {months.map((r) => {
            const [year, month] = r.split('-');
            const isSelected = selectedDate.year === year && selectedDate.month === month;
            return (
              <DateListContainer
                key={r}
                onClick={() => {
                  setSelectedDate({ year, month });
                  setIsDateModalOpen(false);
                }}
              >
                <DateText>
                  {year}년 {month}월
                </DateText>
                {isSelected && (
                  <Image src={'/icons/checked_36.svg'} width={36} height={36} alt="checked" />
                )}
              </DateListContainer>
            );
          })}
        </BottonSheetContent>
      </BottomSheet>
    </Wrapper>
  );
};

export default ConsumptionReport;

const Container = styled.div`
  width: 100%;
  padding: 12px 22px;
  display: flex;
  flex-direction: column;
`;

const DateContainer = styled.div`
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  ${typoStyleMap['title2']};
  color: ${semanticColor.text.normal.primary};
  gap: 20px;
  margin-bottom: 20px;
`;

const CircleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CircleContainer = styled.div`
  position: relative;
  width: 332px;
  height: 365px;
  border-radius: 12px;
  overflow: hidden;
  background: '#F9FAFB';
  z-index: 0;
`;

const ReportContainer = styled.div`
  margin-top: 52px;
  margin-bottom: 90px;
  padding-bottom: 90px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

interface StyledCircleProps {
  size: number;
  top: number;
  left: number;
  $rotate: number;
  $zIndex: number;
  $bgColor: string;
  $color: string;
}

const StyledCircle = styled(motion.div, {
  shouldForwardProp: (prop) => !['$rotate', '$zIndex', '$bgColor', '$color'].includes(prop),
})<StyledCircleProps>`
  position: absolute;
  top: ${({ top }) => `${top}px`};
  left: ${({ left }) => `${left}px`};
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: 50%;
  border: 3px solid ${semanticColor.bg.default};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background-color: ${({ $bgColor }) => $bgColor};
  color: ${({ $color }) => $color};
  z-index: ${({ $zIndex }) => $zIndex};
`;

const Percentage = styled.div`
  ${typoStyleMap['head1']};
`;

const Category = styled.div`
  ${typoStyleMap['body1_m']};
`;

const Account = styled.div`
  ${typoStyleMap['caption1_m']};
`;

const BottonSheetTitle = styled.div`
  padding: 12px 0px;
  ${typoStyleMap['title3']};
  color: ${semanticColor.text.normal.primary};
`;

const BottonSheetContent = styled.div`
  padding: 0 0 40px 0;
  height: 240px;
  overflow-y: scroll;
`;

const DateListContainer = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
`;

const DateText = styled.div`
  ${typoStyleMap['body1_m']};
  color: ${semanticColor.text.normal.sub1};
  height: 35px;
  padding-top: 8px;
`;
