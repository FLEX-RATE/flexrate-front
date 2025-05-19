'use client';
import React, { useState } from 'react';

import Header from '@/components/Header/Header';
import { Wrapper } from '@/components/loanApplicationFunnel/LoanApplicationFunnel.style';
import LoginForm from '@/components/login/LoginForm/LoginForm';
import LoginSelector from '@/components/login/LoginSelector/LoginSelector';

type Step = 'selector' | 'form';

export default function LoginPage() {
  const [step, setStep] = useState<Step>('selector');

  return (
    <Wrapper>
      <Header />
      {step === 'selector' && (
        <LoginSelector
          onSelectEmail={() => setStep('form')}
          onSelectFace={() => {
          }}
          onSelectPassword={() => setStep('form')}
        />
      )}
      {step === 'form' && <LoginForm />}
    </Wrapper>
  );
}
