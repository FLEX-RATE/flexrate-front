// 성별 선택 컴포넌트
// @author 윤영찬
// @since 2025-05-13

'use client';
import React, { useState } from 'react';

interface GenderProps {
  onNext: (gender: string) => void;
}

const Gender = ({ onNext }: GenderProps) => {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleNext = (gender: string) => {
    setSelectedGender(gender);
    onNext(gender);
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">성별을 알려주세요</h2>
      <button
        onClick={() => handleNext('female')}
        className={`w-full p-3 ${selectedGender === 'female' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded mb-2`}
      >
        여성
      </button>
      <button
        onClick={() => handleNext('male')}
        className={`w-full p-3 ${selectedGender === 'male' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
      >
        남성
      </button>
    </div>
  );
};

export default Gender;
