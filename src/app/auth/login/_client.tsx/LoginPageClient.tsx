'use client';
import React, { useState } from 'react';

import Header from '@/components/Header/Header';
import { Wrapper } from '@/components/loanApplicationFunnel/LoanApplicationFunnel.style';
import LoginForm from '@/components/login/LoginForm/LoginForm';
import LoginSelector from '@/components/login/LoginSelector/LoginSelector';
type Step = 'selector' | 'form' | 'PinEmailVerification' | 'pin';

const LoginPageClient = () => {
  const [step, setStep] = useState<Step>('selector');

  return (
    <Wrapper>
      <Header backIcon />
      {step === 'selector' && (
        <LoginSelector
          // onSelectPin={() => setStep('pin')}
          // onSelectFace={() => {
          //   // Face ID 로직
          // }}
          onSelectPassword={() => setStep('form')}
        />
      )}
      {step === 'form' && <LoginForm />}
      {/* 
      {step === 'pin' && <PinLogin />} */}
    </Wrapper>
  );
};

export default LoginPageClient;
