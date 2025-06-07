import React, { useState } from 'react';
import { base64ToArrayBuffer, arrayBufferToBase64 } from './fido2Utils';

export default function PasskeyLoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!window.PublicKeyCredential) {
        throw new Error('이 브라우저는 패스키를 지원하지 않습니다.');
      }

      // 서버에서 로그인용 challenge 받아오기
      const resp = await fetch('/api/fido2/login/request', {
        method: 'POST',
      });
      if (!resp.ok) throw new Error('로그인 요청 실패');

      const options: PublicKeyCredentialRequestOptions = await resp.json();

      // 옵션의 challenge 및 allowCredentials id ArrayBuffer 변환
      options.challenge = base64ToArrayBuffer(options.challenge as unknown as string);
      if (options.allowCredentials) {
        options.allowCredentials = options.allowCredentials.map((cred) => ({
          ...cred,
          id: base64ToArrayBuffer(cred.id as unknown as string),
        }));
      }

      const credential = (await navigator.credentials.get({
        publicKey: options,
      })) as PublicKeyCredential;

      if (!credential) throw new Error('패스키 로그인 취소');

      const authResponse = credential.response as AuthenticatorAssertionResponse;

      // 클라이언트 데이터 전송용 변환
      const clientDataJSON = arrayBufferToBase64(authResponse.clientDataJSON);
      const authenticatorData = arrayBufferToBase64(authResponse.authenticatorData);
      const signature = arrayBufferToBase64(authResponse.signature);
      const userHandle = authResponse.userHandle
        ? arrayBufferToBase64(authResponse.userHandle)
        : null;

      // 서버에 검증 요청
      const verifyResp = await fetch('/api/fido2/login/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: credential.id,
          rawId: arrayBufferToBase64(credential.rawId),
          type: credential.type,
          response: {
            clientDataJSON,
            authenticatorData,
            signature,
            userHandle,
          },
        }),
      });
      if (!verifyResp.ok) throw new Error('패스키 로그인 검증 실패');

      setSuccess(true);
    } catch (e: any) {
      setError(e.message || '패스키 로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {success ? (
        <p>패스키 로그인 성공!</p>
      ) : (
        <>
          <button onClick={handleLogin} disabled={loading}>
            {loading ? '로그인 중...' : '패스키 로그인 시도'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
    </div>
  );
}
