'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/Button/Button';
import CheckBox from '@/components/CheckBox/CheckBox';
import {
  CheckBoxContainer,
  SmallCheckBoxes,
} from '@/components/creditEvaluationStep/AgreementCredit.style';
import TextField from '@/components/TextField/TextField';
import { useDelayedLoading } from '@/hooks/useDelayLoading';
import { useGetLoanReivewApplication } from '@/hooks/useLoanApplication';
import { applicationAgreeSchema } from '@/schemas/application.schema';
import { formatNumberComma } from '@/utils/formatNumberComma';

import { ReviewResultSkeleton } from '../../skeletons/ReviewResultSkeleton';
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

type FormData = z.infer<typeof applicationAgreeSchema.약관동의>;

interface ReviewResultProps {
  value: FunnelContextMap['대출신청접수'];
  onChange: (ctx: FunnelContextMap['대출신청접수']) => void;
  onSubmit: () => void;
}

const ReviewResultAndLoanApplication = ({ value, onChange, onSubmit }: ReviewResultProps) => {
  const token = typeof window !== undefined ? localStorage.getItem('accessToken') ?? '' : '';
  const { data: result, isLoading } = useGetLoanReivewApplication(token);

  const showSkeleton = useDelayedLoading(isLoading, 2000);

  const {
    watch,
    setValue,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(applicationAgreeSchema.약관동의),
    mode: 'onChange',
  });

  if (showSkeleton || isLoading) return <ReviewResultSkeleton />;

  const agreeService = watch('agreeService');
  const agreeCredit = watch('agreeCredit');
  const agreeProduct = watch('agreeProduct');
  const agreeDescription = watch('agreeDescription');

  const allChecked = agreeService && agreeCredit && agreeProduct && agreeDescription;

  const handleAllChange = (val: boolean) => {
    setValue('agreeService', val, { shouldValidate: true });
    setValue('agreeCredit', val, { shouldValidate: true });
    setValue('agreeProduct', val, { shouldValidate: true });
    setValue('agreeDescription', val, { shouldValidate: true });
  };

  const isLoanInfoValid = value.loanAmount > 0 && value.repaymentMonth > 0;
  const isFormValid = isValid && isLoanInfoValid;

  const loanLimit = result ? formatNumberComma(result?.loanLimit) : '';

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
            <CheckBoxContainer>
              <CheckBox
                size="large"
                checked={allChecked}
                label="전체 동의하기"
                onChange={handleAllChange}
              />

              <SmallCheckBoxes>
                <CheckBox
                  size="small"
                  label="[필수] 비대면 채널 대출상품 서비스 이용약관"
                  showMoreText="더보기"
                  showMoreUrl="https://ryuseunghan.notion.site/202c3966a14380db93c1ee48f92e56ff?source=copy_link"
                  checked={agreeService}
                  onChange={(val) => setValue('agreeService', val, { shouldValidate: true })}
                />

                <CheckBox
                  size="small"
                  label="[필수] 은행 여신거래 기본약관 (가계용)"
                  showMoreText="더보기"
                  showMoreUrl="https://ryuseunghan.notion.site/202c3966a14380499e59cf81113b1ca0?source=copy_link"
                  checked={agreeCredit}
                  onChange={(val) => setValue('agreeCredit', val, { shouldValidate: true })}
                />

                <CheckBox
                  size="small"
                  label="[필수] 비대면 금융상품 설명 확인서"
                  showMoreText="더보기"
                  showMoreUrl="https://ryuseunghan.notion.site/202c3966a143802d8f64ef33c191f10e?source=copy_link"
                  checked={agreeProduct}
                  onChange={(val) => setValue('agreeProduct', val, { shouldValidate: true })}
                />

                <CheckBox
                  size="small"
                  label="[필수] FlexRate 대출 상품 설명서"
                  showMoreText="더보기"
                  showMoreUrl="https://ryuseunghan.notion.site/FlexRate-204c3966a14380b3a8bef1c14291c956?source=copy_link"
                  checked={agreeDescription}
                  onChange={(val) => setValue('agreeDescription', val, { shouldValidate: true })}
                />
              </SmallCheckBoxes>
            </CheckBoxContainer>
          </LoanApplicationContainer>
        </MainContainer>
        <BtnContainer>
          <Button text="대출 신청하기" onClick={onSubmit} disabled={!isFormValid} />
        </BtnContainer>
      </Container>
    )
  );
};

export default ReviewResultAndLoanApplication;
