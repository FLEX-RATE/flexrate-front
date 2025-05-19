// 이메일과 함께 발송된 인증번호를 입력하여 인증하는 컴포넌트
// @author 윤영찬
// @since 2025-05-13

'use client';

import React, { useState } from 'react';

interface SignupEmailVerifyProps {
  defaultEmail: string;
  onVerify: (context: { email: string; verificationCode: string }) => void;
}

const SignupEmailVerify = ({ defaultEmail, onVerify }: SignupEmailVerifyProps) => {
  const [verificationCode, setVerificationCode] = useState('');

  const handleVerify = () => {
    if (!verificationCode.trim()) {
      alert('인증번호를 입력해주세요.');
      return;
    }
    onVerify({ email: defaultEmail, verificationCode: verificationCode.trim() });
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">인증번호 입력</h2>
      <input
        type="text"
        value={defaultEmail}
        readOnly
        className="w-full p-3 border rounded mb-2 bg-gray-100"
      />
      <input
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder="인증번호 입력"
        className="w-full p-3 border rounded mb-4"
      />
      <button
        onClick={handleVerify}
        className="w-full p-4 bg-blue-500 text-white rounded"
      >
        인증하기
      </button>
    </div>
  );
};

export default SignupEmailVerify;
