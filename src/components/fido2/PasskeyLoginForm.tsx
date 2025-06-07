import React, { useState } from 'react';
import { base64ToArrayBuffer, arrayBufferToBase64 } from '../../apis/fido2Utils';
import { getPasskeyLoginChallenge, loginWithPasskey } from '../../apis/auth';
import { useRouter } from 'next/router';
import type {
  PasskeyLoginChallengeRequest,
  PasskeyLoginChallengeResponse,
  PasskeyLoginRequest,
  AllowedCredential,
} from '../../types/auth.type';

export default function PasskeyLoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!window.PublicKeyCredential) {
        throw new Error('이 브라우저는 패스키를 지원하지 않습니다.');
      }

      if (!email) {
        throw new Error('이메일을 입력하세요.');
      }

      const reqData: PasskeyLoginChallengeRequest = { email };
      const options: PasskeyLoginChallengeResponse = await getPasskeyLoginChallenge(reqData);

      const publicKey: PublicKeyCredentialRequestOptions = {
        ...options,
        challenge: base64ToArrayBuffer(options.challenge),
        allowCredentials: options.allowedCredentialIds
          ? options.allowedCredentialIds.map((cred: AllowedCredential) => ({
              id: base64ToArrayBuffer(cred.id),
              type: 'public-key', // 여기서 string 대신 리터럴 타입 지정
              transports: cred.transports as AuthenticatorTransport[] | undefined,
            }))
          : undefined,
      };

      const credential = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential;

      if (!credential) throw new Error('패스키 로그인 취소');

      const authResponse = credential.response as AuthenticatorAssertionResponse;

      const clientDataJSON = arrayBufferToBase64(authResponse.clientDataJSON);
      const authenticatorData = arrayBufferToBase64(authResponse.authenticatorData);
      const signature = arrayBufferToBase64(authResponse.signature);
      const userHandle = authResponse.userHandle ? arrayBufferToBase64(authResponse.userHandle) : null;

      const verifyReq: PasskeyLoginRequest = {
        email,
        passkeyData: {
          credentialId: arrayBufferToBase64(credential.rawId),
          clientDataJSON,
          authenticatorData,
          signature,
        },
        authMethod: 'passkey',
        deviceInfo: navigator.userAgent,
        challenge: options.challenge,
        rawId: arrayBufferToBase64(credential.rawId),
      };

      const loginResponse = await loginWithPasskey(verifyReq);

      localStorage.setItem('accessToken', loginResponse.accessToken);
      router.push('/dashboard');
    } catch (e: any) {
      setError(e.message || '패스키 로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="이메일 입력"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? '로그인 중...' : '패스키 로그인 시도'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
