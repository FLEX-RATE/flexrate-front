'use client';

import React, { useState, useMemo, useEffect } from 'react';

import { useRouter } from 'next/navigation';  // 1. import 추가

import { loginWithPin } from '@/apis/auth';
import AddPinLogin from '@/components/login/PinLogin/AddPinLogin/AddPinLogin';
import PinEmailForm from '@/components/login/PinLogin/PinEmailForm/PinEmailForm';

import {
  Container,
  Title,
  DotWrapper,
  Dot,
  KeypadWrapper,
  KeyButton,
} from './PinLogin.style';

const PIN_LENGTH = 6;

const shuffleArray = (array: number[]) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const PinLogin = () => {
  const router = useRouter();  // 2. router 선언

  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [showPinEmailForm, setShowPinEmailForm] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [showAddPin, setShowAddPin] = useState(false);

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
    const doLogin = async () => {
      setLoading(true);
      try {
        const response = await loginWithPin({ pin: pinStr });
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        alert(`인증되었습니다! ${response.username}님.`);
        // TODO: 로그인 성공 후 페이지 이동 또는 상태 업데이트
        router.push('/');  // 예: 홈 페이지로 이동
      } catch (error) {
        console.error(error);
        alert('PIN이 올바르지 않거나 오류가 발생했습니다.');
        setPin(Array(PIN_LENGTH).fill('')); // PIN 초기화
      } finally {
        setLoading(false);
      }
    };
    doLogin();
  }
}, [pin, router]);

  if (showAddPin) {
    return (
      <AddPinLogin
        email={verifiedEmail}
        onComplete={() => {
          setShowAddPin(false);
          setPin(Array(PIN_LENGTH).fill(''));
        }}
      />
    );
  }

  if (showPinEmailForm) {
    return (
      <PinEmailForm
        onVerified={(emailFromForm: string) => {
          alert('이메일 인증 완료!');
          setVerifiedEmail(emailFromForm);
          setShowPinEmailForm(false);
          setShowAddPin(true);
        }}
        // onCancel={() => setShowPinEmailForm(false)}
      />
    );
  }

  return (
    <Container>
      <Title>PIN번호 입력</Title>
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
          ←
        </KeyButton>
      </KeypadWrapper>
    </Container>
  );
};

export default PinLogin;
