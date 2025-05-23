'use client';

import React from 'react';

import { useFunnel } from '@use-funnel/browser';

import Header from '@/components/Header/Header';
import { Wrapper } from '@/components/loanApplicationFunnel/LoanApplicationFunnel.style';
import Agreement from '@/components/signup/AgreeForConsumptionType/AgreeForConsumptionType';
import ConsumptionResult from '@/components/signup/ConsumptionResult/ConsumptionResult';
import EmailForm from '@/components/signup/EmailForm/EmailForm';
import PasswordForm from '@/components/signup/PasswordForm/PasswordForm';
import { SignupSteps } from '@/types/funnel.type';
import { InfoForm } from '@/components/signup/InfoForm/InfoForm';
import { characterMap } from '@/utils/signup.util';
import { ConsumptionTypeKey } from '@/constants/auth.constant';
import ConsumptionGoalStep from '@/components/signup/ConsumptionGoalStep/ConsumptionGoalStep';

const SignupPage = () => {
  const funnel = useFunnel<SignupSteps>({
    id: 'signup',
    initial: { step: '이메일인증', context: { email: '' } },
  });

  return (
    <Wrapper>
      <Header backIcon={funnel.step !== '이메일인증'} />
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
              onNext={({ password, method }) => {
                const nextStep = method === '간편비밀번호' ? '간편비밀번호설정' : '내정보입력';
                funnel.history.push(nextStep, (prev) => ({
                  ...prev,
                  ...context,
                  password,
                  method,
                }));
              }}
            />
          ),
        })}
        간편비밀번호설정={funnel.Render.with({
          render: () => (
            <div>
              <h2>간편 비밀번호 설정</h2>
            </div>
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
                // 유저 정보 입력 후 소비 성향 체크 단계로 이동
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
          render: () => (
            <Agreement
              onNext={() =>
                funnel.history.push('소비성향결과', (prev) => ({
                  ...(prev as SignupSteps['소비성향결과']),
                  agreement: true,
                }))
              }
            />
          ),
        })}
        소비성향결과={funnel.Render.with({
          render: ({ context }) => {
            return (
              <ConsumptionResult
                userName={context.name ?? '사용자'}
                onNext={(consumptionTypeKey) =>
                  funnel.history.push('소비목적결과', (prev) => ({
                    ...(prev as SignupSteps['소비목적결과']),
                    consumptionType: consumptionTypeKey as ConsumptionTypeKey,
                    consumptionGoal: '',
                  }))
                }
              />
            );
          },
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
