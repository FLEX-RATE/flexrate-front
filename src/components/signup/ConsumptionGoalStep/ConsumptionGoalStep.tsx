'use client';

import ConsumptionGoal from '@/components/signup/ConsumptionGoal/ConsumptionGoal';
import { CharacterInfo } from '@/constants/auth.constant';
import { usePostSignup } from '@/hooks/usePostSignup';
import { ConsumptionType } from '@/stores/userStore';
import { SignupSteps } from '@/types/funnel.type';

const ConsumptionGoalStep = ({
  context,
  character,
}: {
  context: SignupSteps['소비목적결과'];
  character: CharacterInfo;
}) => {
  const signupMutation = usePostSignup();

  return (
    <ConsumptionGoal
      consumptionType={character}
      onComplete={(selectedGoal) => {
        const signupData = {
          email: context.email,
          password: context.password,
          sex: context.sex as 'MALE' | 'FEMALE',
          name: context.name,
          birthDate: context.birthDate,
          consumptionType: context.consumptionType as ConsumptionType,
          consumeGoal: selectedGoal,
          ...(context.pin ? { pin: context.pin } : {}),
        };

        console.log('최종 회원가입 데이터:', signupData);
        
        signupMutation.mutate(signupData);
      }}
    />
  );
};

export default ConsumptionGoalStep;
