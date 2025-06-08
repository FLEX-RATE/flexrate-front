'use client';

import React, { useState, useMemo, useEffect } from 'react';

import Image from 'next/image';

import { registerPin } from '@/apis/auth';
import {
  Container,
  Dot,
  DotWrapper,
  KeyButton,
  KeypadWrapper,
  Title,
} from '@/components/signup/SignupPinForm/SignupPinForm.style';
import { useUserStore } from '@/stores/userStore';

const PIN_LENGTH = 6;

const shuffleArray = (array: number[]) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

type AddPinLoginProps = {
  email: string;
  onComplete: (pinStr: string) => void;
};

const AddPinLogin = ({ onComplete }: AddPinLoginProps) => {
  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(''));
  const [confirmPin, setConfirmPin] = useState<string[]>(Array(PIN_LENGTH).fill(''));
  const [step, setStep] = useState<'input' | 'confirm'>('input');
  const [loading, setLoading] = useState(false);
  const token = useUserStore((state) => state.accessToken);

  const shuffledNumbers = useMemo(() => shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]), []);

  const handleKeyClick = (key: string) => {
    if (loading) return;

    const targetPin = step === 'input' ? [...pin] : [...confirmPin];

    if (key === 'del') {
      const lastFilled = targetPin.findLastIndex((d) => d !== '');
      if (lastFilled >= 0) targetPin[lastFilled] = '';
    } else if (key === 'reset') {
      targetPin.fill('');
    } else {
      const firstEmpty = targetPin.findIndex((d) => d === '');
      if (firstEmpty >= 0) targetPin[firstEmpty] = key;
    }

    if (step === 'input') {
      setPin(targetPin);
    } else {
      setConfirmPin(targetPin);
    }
  };

  useEffect(() => {
    const pinStr = pin.join('');
    if (step === 'input' && pinStr.length === PIN_LENGTH && !pin.includes('')) {
      setStep('confirm');
      setConfirmPin(Array(PIN_LENGTH).fill(''));
    }
  }, [pin, step]);

  useEffect(() => {
    const confirmPinStr = confirmPin.join('');
    if (step === 'confirm' && confirmPinStr.length === PIN_LENGTH && !confirmPin.includes('')) {
      const pinStr = pin.join('');
      if (pinStr !== confirmPinStr) {
        alert('PIN이 일치하지 않습니다. 다시 입력해 주세요.');
        setPin(Array(PIN_LENGTH).fill(''));
        setConfirmPin(Array(PIN_LENGTH).fill(''));
        setStep('input');
        return;
      }

      setLoading(true);
      setTimeout(() => {
        registerPin(token!, { pin: pinStr })
          .then(() => {
            alert('PIN 등록 완료!');
            setLoading(false);
            onComplete(pinStr);
          })
          .catch((error) => {
            console.error('PIN 등록 실패:', error);
            alert('PIN 등록에 실패했습니다.');
            setLoading(false);
          });
      }, 800);
    }
  }, [confirmPin, pin, step, onComplete]);

  return (
    <Container>
      <Title>{step === 'input' ? '등록하실 PIN 6자리 입력하세요' : 'PIN 다시 입력해주세요'}</Title>
      <DotWrapper>
        {(step === 'input' ? pin : confirmPin).map((digit, i) => (
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
        <KeyButton>
          <Image
            src={'/icons/deletePad.svg'}
            onClick={() => handleKeyClick('del')}
            alt="삭제하기"
            width={27}
            height={20}
          />
        </KeyButton>
      </KeypadWrapper>
    </Container>
  );
};

export default AddPinLogin;
