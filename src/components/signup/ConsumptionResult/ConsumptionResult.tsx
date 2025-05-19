'use client';
import React from 'react';

interface Props {
  onNext: () => void;
}

const ConsumptionResult = ({ onNext }: Props) => {
  return (
    <div>
      <h1>소비 성향 결과</h1>
      <button onClick={onNext}>다음으로</button>
    </div>
  );
};

export default ConsumptionResult;
