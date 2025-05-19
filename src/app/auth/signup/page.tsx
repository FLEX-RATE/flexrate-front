'use client';
import React from 'react';
import { useFunnel } from '@use-funnel/browser';

import SignupPassword from './components/SignupPassword';
import SignupMethodSelector from './components/SignupMethodSelector';
import Agreement from './components/Agreement';
import { Wrapper } from '@/components/loanApplicationFunnel/LoanApplicationFunnel.style';
import Header from '@/components/Header/Header';
import EmailForm from '@/components/signup/EmailForm/EmailForm';
import InfoForm from '@/components/signup/InfoForm/InfoForm';
import ConsumptionResult from '../../../components/signup/ConsumptionResult/ConsumptionResult';
import ConsumptionGoal from '../../../components/signup/ConsumptionGoal/ConsumptionGoal';


export type SignupSteps = {
  이메일인증: { email?: string; verifyPassword?: number };
  비밀번호설정: { email: string; password?: string };
  로그인수단설정: { email: string; password: string; method?: string };
  내정보설정: {
    email: string;
    password: string;
    method: string;
    gender?: string;
    birthDate?: string;
    name?: string;
  };
  소비성향체크: {
    email: string;
    password: string;
    method: string;
    gender: string;
    birthDate: string;
    name: string;
    agreement?: boolean;
  };
  소비성향결과: {
    email: string;
    password: string;
    method: string;
    gender: string;
    birthDate: string;
    name: string;
    agreement: boolean;
  };
  소비목적결과: {
    email: string;
    password: string;
    method: string;
    gender: string;
    birthDate: string;
    name: string;
    agreement: boolean;
    cosumptionType?: string;
    consumptionGoal?: string;
  };
};

export default function SignupPage() {
  const funnel = useFunnel<SignupSteps>({
    id: 'signup',
    initial: { step: '이메일인증', context: { email: '' } },
  });


  return (
    <Wrapper>
      <Header backIcon={funnel.step !== '이메일인증'} />
      <funnel.Render
        이메일인증={funnel.Render.with({
          render: ({ context }) => (
            <EmailForm
              onNext={(email) =>
                funnel.history.push('비밀번호설정', (prev) => ({ ...prev, email }))
              }
            />
          ),
        })}
        비밀번호설정={funnel.Render.with({
          render: ({ context }) => (
            <SignupPassword
              email={context.email}
              onNext={(password: string) =>
                funnel.history.push('로그인수단설정', (prev) => ({ ...prev, ...context, password }))
              }
            />
          ),
        })}
        로그인수단설정={funnel.Render.with({
          render: ({ context }) => (
            <SignupMethodSelector
              onSelect={(method: string) =>
                funnel.history.push('내정보설정', (prev) => ({ ...prev, ...context, method }))
              }
            />
          ),
        })}
        내정보설정={funnel.Render.with({
          render: ({ context }) => (
            <InfoForm
              onNext={(info: { gender: string; birthDate: string; name: string }) =>
                funnel.history.push('소비성향체크', (prev) => ({ ...prev, ...context, ...info }))
              }
            />
          ),
        })}
        소비성향체크={funnel.Render.with({
          render: ({ context }) => (
            <Agreement
              onAgree={() =>
                funnel.history.push('소비성향결과', (prev) => ({
                  ...prev,
                  ...context,
                  agreement: true,
                }))
              }
            />
          ),
        })}
        소비성향결과={funnel.Render.with({
          render: ({ context }) => (
            <ConsumptionResult
              onNext={() =>
                funnel.history.push('소비목적결과', (prev) => ({
                  ...prev,
                  ...context,
                  consumptionGoal: '',
                }))
              }
            />
          ),
        })}

        소비목적결과={funnel.Render.with({
          render: ({ context }) => (
            <ConsumptionGoal
              onComplete={() => console.log('회원가입 완료', context)}
            />
          ),
        })}
      />
    </Wrapper>
  );
}
