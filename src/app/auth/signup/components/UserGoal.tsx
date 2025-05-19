// 회원가입 과정 중 소비 목표를 설정 컴포넌트
// @author 윤영찬
// @since 2025-05-13

'use client';

import React from 'react';

interface UserGoalProps {
  onNext: () => void;
}

const UserGoal = ({ onNext }: UserGoalProps) => {
  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">소비 목표 설정</h2>
      <p className="mb-4">매달 소액의 저축을 목표로 해요</p>
      <button onClick={onNext} className="w-full p-4 bg-blue-500 text-white rounded">
        다음으로
      </button>
    </div>
  );
};

export default UserGoal;
