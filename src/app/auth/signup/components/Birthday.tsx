//  사용자가 날짜를 선택하면 다음 단계로 진행하는 페이지.
//  @author 윤영찬
//  @since 2025-05-13

'use client';
import React, { useState } from 'react';

interface BirthdayProps {
  onNext: (birthday: string) => void;
}

const Birthday = ({ onNext }: BirthdayProps) => {
  const [birthday, setBirthday] = useState('');

  const handleNext = () => {
    if (birthday) {
      onNext(birthday);
    } else {
      alert('생년월일을 선택해주세요.');
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">생년월일을 알려주세요</h2>
      <input
        type="date"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />
      <button onClick={handleNext} className="w-full p-4 bg-blue-500 text-white rounded">
        다음으로
      </button>
    </div>
  );
};

export default Birthday;

