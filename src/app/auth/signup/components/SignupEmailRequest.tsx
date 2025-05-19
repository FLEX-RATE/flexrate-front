'use client';

import React, { useState } from 'react';

interface SignupEmailRequestProps {
  onNext: (email: string) => void;
}

const SignupEmailRequest = ({ onNext }: SignupEmailRequestProps) => {
  const [email, setEmail] = useState('');

  const handleNext = () => {
    if (!email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }
    onNext(email.trim());
  };

  return (
    <div className="p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">이메일로 인증 요청하기</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border rounded mb-4"
        placeholder="이메일 주소 입력"
      />
      <button
        onClick={handleNext}
        className="w-full p-3 bg-blue-500 text-white rounded"
      >
        인증 요청하기
      </button>
    </div>
  );
};

export default SignupEmailRequest;
