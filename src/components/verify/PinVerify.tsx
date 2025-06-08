'use client';

import React, { useState, useMemo, useEffect } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { verifyPin } from '@/apis/auth';
import { usePostLoanApplication } from '@/hooks/useLoanApplication';
import { useLoanFunnelStore } from '@/stores/LoanFunnelStore';
import { useUserStore } from '@/stores/userStore';

import {
  Container,
  Dot,
  DotWrapper,
  KeyButton,
  KeypadWrapper,
  Title,
} from '../signup/SignupPinForm/SignupPinForm.style';

const PIN_LENGTH = 6;

const shuffleArray = (array: number[]) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const PinVerify = () => {
  const router = useRouter();
  const token = useUserStore((state) => state.accessToken);

  const { funnelContext } = useLoanFunnelStore();

  const { mutate: applyLoan } = usePostLoanApplication(token!);

  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);

  const shuffledNumbers = useMemo(() => shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]), []);

  const handleKeyClick = (key: string) => {
    if (loading) return;

    const newPin = [...pin];

    if (key === 'del') {
      const lastFilled = newPin.findLastIndex((d) => d !== '');
      if (lastFilled >= 0) newPin[lastFilled] = '';
    } else if (key === 'reset') {
      newPin.fill('');
    } else {
      const firstEmpty = newPin.findIndex((d) => d === '');
      if (firstEmpty >= 0) newPin[firstEmpty] = key;
    }

    setPin(newPin);
  };

  useEffect(() => {
    const pinStr = pin.join('');
    if (pinStr.length === PIN_LENGTH && !pin.includes('')) {
      const doVerify = async () => {
        setLoading(true);
        try {
          const isValid = await verifyPin(pinStr, token!);
          if (isValid) {
            const requestBody = {
              loanAmount: funnelContext['대출신청접수']?.loanAmount ?? 0,
              repaymentMonth: funnelContext['대출신청접수']?.repaymentMonth ?? 1,
            };

            applyLoan(requestBody, {
              onSuccess: () => {
                router.push('/loan-result');
              },
              onError: (error) => {
                alert('대출 신청 중 오류가 발생했습니다.');
                console.error(error);
                setPin(Array(PIN_LENGTH).fill(''));
              },
            });
          } else {
            alert('PIN이 올바르지 않습니다.');
            setPin(Array(PIN_LENGTH).fill(''));
          }
        } catch (error) {
          console.error('PIN 인증 중 오류 발생:', error);
          alert('오류가 발생했습니다. 다시 시도해주세요.');
          setPin(Array(PIN_LENGTH).fill(''));
        } finally {
          setLoading(false);
        }
      };
      doVerify();
    }
  }, [pin, router, applyLoan, funnelContext]);

  return (
    <Container>
      <Title>PIN 번호 입력</Title>
      <DotWrapper>
        {pin.map((digit, i) => (
          <Dot key={i} filled={digit !== ''} />
        ))}
      </DotWrapper>

      <KeypadWrapper>
        {shuffledNumbers.map((num) => (
          <KeyButton key={num} onClick={() => handleKeyClick(num.toString())} disabled={loading}>
            {num}
          </KeyButton>
        ))}
        <KeyButton onClick={() => handleKeyClick('reset')} disabled={loading}>
          전체삭제
        </KeyButton>
        <KeyButton onClick={() => handleKeyClick('0')} disabled={loading}>
          0
        </KeyButton>
        <KeyButton onClick={() => handleKeyClick('del')} disabled={loading}>
          <Image src={'/icons/deletePad.svg'} alt="삭제하기" width={27} height={20} />
        </KeyButton>
      </KeypadWrapper>
    </Container>
  );
};

export default PinVerify;
