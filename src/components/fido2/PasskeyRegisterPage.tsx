// components/PasskeyRegisterPage.tsx (클라이언트 컴포넌트)
'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { getFido2RegisterChallenge, verifyFido2Register } from '@/apis/auth';
import { base64ToArrayBuffer, arrayBufferToBase64 } from '@/utils/encoding';

type Props = {
  memberId: number;
};

const PasskeyRegisterPage = ({ memberId }: Props) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleRegisterPasskey = async () => {
    console.log('패스키 등록 시작 - memberId:', memberId);

    try {
      // 1. 서버에서 challenge 받아오기
      const challengeStr = await getFido2RegisterChallenge(memberId);
      console.log('서버에서 받은 challenge:', challengeStr);

      const challenge = base64ToArrayBuffer(challengeStr);

      // 2. 패스키 생성 요청
      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: 'Flexrate',
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(String(memberId)),
          name: `user-${memberId}`,
          displayName: `User ${memberId}`,
        },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        authenticatorSelection: {
          userVerification: 'required',
          residentKey: 'preferred',
          authenticatorAttachment: 'platform',
        },
        timeout: 60000,
        attestation: 'none',
      };

      console.log('publicKey 옵션 준비 완료:', publicKey);

      const credential = (await navigator.credentials.create({
        publicKey,
      })) as PublicKeyCredential;

      console.log('navigator.credentials.create 결과:', credential);

      const response = credential.response as AuthenticatorAttestationResponse;

      // 3. 등록 정보 가공
      const credentialId = arrayBufferToBase64(credential.rawId);
      const clientDataJSON = arrayBufferToBase64(response.clientDataJSON);
      const attestationObject = arrayBufferToBase64(response.attestationObject);

      console.log('가공된 등록 정보:', { credentialId, clientDataJSON, attestationObject });

      const passkeyData = {
        credentialId,
        publicKey: '', // 등록 시 서버에서 저장 안 하도록 구현돼 있으면 생략 가능
        signCount: 0,
        deviceInfo: navigator.userAgent,
        authenticatorData: attestationObject,
        clientDataJSON,
        signature: '', // 등록에는 필요 없음
      };

      // 4. 서버에 검증 요청
      const verifyResult = await verifyFido2Register(memberId, passkeyData);
      console.log('서버 검증 결과:', verifyResult);

      alert('패스키 등록 성공!');
      router.push('/login'); // 등록 완료 후 라우팅

    } catch (err) {
      console.error('패스키 등록 중 오류:', err);
      setError('패스키 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h1>패스키 등록</h1>
      <button onClick={handleRegisterPasskey}>등록 시작하기</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PasskeyRegisterPage;
