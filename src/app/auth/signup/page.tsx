'use client';

import React from 'react';

import { useFunnel } from '@use-funnel/browser';

import Header from '@/components/Header/Header';
import { Wrapper } from '@/components/loanApplicationFunnel/LoanApplicationFunnel.style';
import Agreement from '@/components/signup/AgreeForConsumptionType/AgreeForConsumptionType';
import ConsumptionGoalStep from '@/components/signup/ConsumptionGoalStep/ConsumptionGoalStep';
import ConsumptionResult from '@/components/signup/ConsumptionResult/ConsumptionResult';
import EmailForm from '@/components/signup/EmailForm/EmailForm';
import { InfoForm } from '@/components/signup/InfoForm/InfoForm';
import PasswordForm from '@/components/signup/PasswordForm/PasswordForm';
import SignupPinForm from '@/components/signup/SignupPinForm/SignupPinForm';
import { ConsumptionTypeKey } from '@/constants/auth.constant';
import { SignupSteps } from '@/types/funnel.type';
import { characterMap } from '@/utils/signup.util';

const SignupPage = () => {
  const funnel = useFunnel<SignupSteps>({
    id: 'signup',
    initial: { step: '이메일인증', context: { email: '' } },
  });

  return (
    <Wrapper>
      <Header backIcon={true} />
      <funnel.Render
        이메일인증={funnel.Render.with({
          render: () => (
            <EmailForm
              onNext={(email) =>
                funnel.history.push('비밀번호설정', (prev) => ({ ...prev, email }))
              }
            />
          ),
        })}
        비밀번호설정={funnel.Render.with({
          render: ({ context }) => (
            <PasswordForm
              email={context.email}
              onNext={({ password }) => {
                funnel.history.push('간편비밀번호설정', (prev) => ({
                  ...prev,
                  ...context,
                  password,
                }));
              }}
            />
          ),
        })}
        간편비밀번호설정={funnel.Render.with({
          render: ({ context }) => (
            <SignupPinForm
              onComplete={(pinStr: string) =>
                void funnel.history.push('내정보입력', (prev) => ({
                  ...prev,
                  ...context,
                  pin: pinStr,
                }))
              }
            />
          ),
        })}
        내정보입력={funnel.Render.with({
          render: ({ context }) => (
            <InfoForm
              onNext={({
                sex,
                birthDate,
                name,
              }: {
                sex: string;
                birthDate: string;
                name: string;
              }) => {
                void funnel.history.push('소비성향체크', (prev) => ({
                  ...prev,
                  ...context,
                  sex,
                  birthDate,
                  name,
                }));
              }}
            />
          ),
        })}
        소비성향체크={funnel.Render.with({
          render: ({ context }) => (
            <Agreement
              onNext={() =>
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
              userName={context.name ?? '사용자'}
              onNext={(consumptionTypeKey) =>
                funnel.history.push('소비목적결과', (prev) => ({
                  ...prev,
                  ...context,
                  consumptionType: consumptionTypeKey as ConsumptionTypeKey,
                  consumptionGoal: '',
                }))
              }
            />
          ),
        })}
        소비목적결과={funnel.Render.with({
          render: ({ context }) => {
            const character = characterMap[context.consumptionType as ConsumptionTypeKey];
            return <ConsumptionGoalStep context={context} character={character} />;
          },
        })}
      />
    </Wrapper>
  );
};

export default SignupPage;
