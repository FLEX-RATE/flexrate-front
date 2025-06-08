'use client';

import React, { useState } from 'react';
import { registerPasskey } from '../../apis/fido2Utils';

import { Button, ErrorText, SuccessText } from './PasskeyRegisterForm.style';

export default function PasskeyRegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      await registerPasskey();
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || '패스키 등록 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {success ? (
        <SuccessText>패스키 등록이 완료되었습니다.</SuccessText>
      ) : (
        <>
          <Button onClick={handleRegister} disabled={loading}>
            {loading ? '등록 중...' : '패스키 등록 시작'}
          </Button>
          {error && <ErrorText>{error}</ErrorText>}
        </>
      )}
    </div>
  );
}
