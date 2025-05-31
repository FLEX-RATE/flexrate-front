'use client';

import { useRouter } from 'next/navigation';

import Button from '@/components/Button/Button';
import TextField from '@/components/TextField/TextField';
import { useGetLoanReivewApplication } from '@/hooks/useLoanApplication';
import { formatNumberComma } from '@/utils/formatNumberComma';

import { FunnelContextMap } from '../LoanApplicationFunnel';

import {
  BtnContainer,
  Caption,
  CaptionContainer,
  Container,
  Description,
  LoanApplicationContainer,
  MainContainer,
  MiniTitle,
  Slider,
  SliderContainer,
  SliderTitle,
  SubDescription,
  SubDescriptionContainer,
  SubTitle,
  TableContainer,
  TableItem,
  TableItemKey,
  TableItemValue,
} from './ReviewResultAndLoanApplication.style';

interface ReviewResultProps {
  value: FunnelContextMap['대출신청접수'];
  onChange: (ctx: FunnelContextMap['대출신청접수']) => void;
  onSubmit: () => void;
}

const ReviewResultAndLoanApplication = ({ value, onChange, onSubmit }: ReviewResultProps) => {
  const router = useRouter();
  const token = typeof window !== undefined ? localStorage.getItem('accessToken') ?? '' : '';
  const { data: result } = useGetLoanReivewApplication(token);

  const loanLimit = result ? formatNumberComma(result?.loanLimit) : '';

  const handleSubmit = () => {
    onSubmit();             // 기존 제출 동작 실행
    router.push('/pin/login');  // PIN 인증 페이지로 이동 (경로는 상황에 맞게 수정)
  };

  return (
    result && (
      <Container>
        <MainContainer>
          <SubTitle>상세 내용</SubTitle>
          <TableContainer>
            <TableItem>
              <TableItemKey>성명</TableItemKey>
              <TableItemValue>{result.name}</TableItemValue>
            </TableItem>
            <TableItem>
              <TableItemKey>대출 심사 일자</TableItemKey>
              <TableItemValue>{result.screeningDate}</TableItemValue>
            </TableItem>
            <TableItem>
              <TableItemKey>남은 대출 금액</TableItemKey>
              <TableItemValue>
                <TableItemValue $isStrong={true}>{loanLimit}</TableItemValue>원
              </TableItemValue>
            </TableItem>
            <TableItem>
              <TableItemKey>초기 대출 금리</TableItemKey>
              <TableItemValue>
                연 <TableItemValue $isStrong={true}>{result.initialRate}%</TableItemValue>
              </TableItemValue>
            </TableItem>
            <TableItem>
              <TableItemKey>금리 범위</TableItemKey>
              <TableItemValue>
                연{' '}
                <TableItemValue $isStrong={true}>
                  {result?.rateRangeFrom}% ~ {result.rateRangeTo}%
                </TableItemValue>
              </TableItemValue>
            </TableItem>
            <CaptionContainer>
              <Caption>· 기준금리 4.25% + 가산금리 10.35% - 우대금리 0.1%</Caption>
              <br />
              <Caption>
                · 위 대출금리는 현재 약정 시 조건이며, 대출 실행일의 기준금리에 따라 변동될 수
                있습니다.
              </Caption>
            </CaptionContainer>
          </TableContainer>
          <LoanApplicationContainer>
            <SubTitle>대출 신청 접수</SubTitle>
            <Description>
              대출 가능 한도 내에서
              <br />
              대출 신청 금액을 조정하 기입해주세요
            </Description>
            <TextField
              value={value.loanAmount.toString()}
              onChange={(updatedValue) => {
                if (/^\d*$/.test(updatedValue)) {
                  onChange({ ...value, loanAmount: Number(updatedValue) || 0 });
                }
              }}
            >
              <TextField.Label helperText="단위: 원">대출 금액</TextField.Label>
              <TextField.TextFieldBox placeholder="숫자만 입력하세요" />
            </TextField>
            <SubDescriptionContainer>
              <SubDescription>
                대출 금액은 <SubDescription $isStrong={true}>최대 한도 금액</SubDescription>까지
                가능합니다
              </SubDescription>
            </SubDescriptionContainer>
            <MiniTitle>대출 상환 기간</MiniTitle>
            <SliderContainer>
              <SliderTitle>{value.repaymentMonth}개월</SliderTitle>
              <Slider
                type="range"
                min={1}
                max={12}
                value={value.repaymentMonth}
                onChange={(e) =>
                  onChange({ ...value, repaymentMonth: Number(e.target.value) || 0 })
                }
              ></Slider>
            </SliderContainer>
          </LoanApplicationContainer>
        </MainContainer>
        <BtnContainer>
          <Button text="대출 신청하기" onClick={handleSubmit} />
        </BtnContainer>
      </Container>
    )
  );
};

export default ReviewResultAndLoanApplication;
