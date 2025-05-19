'use client';
import React from 'react';

interface Props {
  onComplete: () => void;
}

const ConsumptionGoal = ({ onComplete }: Props) => {
  return (
    <div>
      <h1>소비 목적 결과</h1>
      <button onClick={onComplete}>회원가입 완료</button>
    </div>
  );
};

export default ConsumptionGoal;
