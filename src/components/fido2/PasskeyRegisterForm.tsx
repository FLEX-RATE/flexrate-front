'use client';

import React, { useState } from 'react';
import { registerPasskey } from './fido2Utils';

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
        <p>패스키 등록이 완료되었습니다.</p>
      ) : (
        <>
          <button onClick={handleRegister} disabled={loading}>
            {loading ? '등록 중...' : '패스키 등록 시작'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
    </div>
  );
}
