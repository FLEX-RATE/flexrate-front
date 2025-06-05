'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  getFido2RegisterChallenge,
  verifyFido2Register,
} from '@/apis/auth'; // 서버 API 함수
import { useUserStore } from '@/stores/userStore';
import { base64ToArrayBuffer, arrayBufferToBase64 } from '@/utils/encoding';

const Fido2RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const router = useRouter();

    const registerPasskey = async () => {
    try {
        setLoading(true);

        if (!user?.email) {
        alert('사용자 정보를 불러올 수 없습니다. 로그인해주세요.');
        router.push('/auth/login');
        return;
        }

        // 서버에서 등록용 challenge 및 옵션 받아오기
        const challengeResponse = await getFido2RegisterChallenge();

        const publicKeyOptions: PublicKeyCredentialCreationOptions = {
        challenge: base64ToArrayBuffer(challengeResponse.challenge),
        rp: challengeResponse.rp,
        user: {
            id: base64ToArrayBuffer(challengeResponse.user.id),
            name: challengeResponse.user.name,
            displayName: challengeResponse.user.displayName,
        },
        pubKeyCredParams: challengeResponse.pubKeyCredParams,
        timeout: challengeResponse.timeout ?? 60000,
        attestation: challengeResponse.attestation ?? 'none',
        authenticatorSelection: challengeResponse.authenticatorSelection ?? {
            userVerification: 'preferred',
        },
        };

        // 클라이언트에서 패스키 생성
        const credential = (await navigator.credentials.create({
        publicKey: publicKeyOptions,
        })) as PublicKeyCredential;

        const attestation = credential.response as AuthenticatorAttestationResponse;

        // 서버에 전송할 데이터 구성
        const payload = {
        credentialId: arrayBufferToBase64(credential.rawId),
        clientDataJSON: arrayBufferToBase64(attestation.clientDataJSON),
        attestationObject: arrayBufferToBase64(attestation.attestationObject),
        email: user.email,
        deviceInfo: window.navigator.userAgent,
        };

        // 서버에 검증 요청
        await verifyFido2Register(payload);

        alert('지문 인증 등록이 완료되었습니다!');
        router.push('/auth/login');
    } catch (err) {
        console.error('패스키 등록 실패:', err);
        alert('패스키 등록에 실패했습니다.');
    } finally {
        setLoading(false);
    }
    };


  useEffect(() => {
    registerPasskey();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>지문 인증 등록 중...</h2>
      {loading && <p>잠시만 기다려주세요.</p>}
    </div>
  );
};

export default Fido2RegisterPage;
