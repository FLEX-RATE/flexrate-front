'use client';
import React from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';



import { loginWithPasskey,
  checkPasskeyRegistered, 
  // verifyFido2Register, 
  // getFido2RegisterChallenge, 
  getPasskeyLoginChallenge, 
  // checkPinRegistered,
 } from '@/apis/auth'
import BottomSheet from '@/components/BottomSheet/BottomSheet';
import { useUserStore } from '@/stores/userStore';
import {
  PasskeyAuthentication,
  PasskeyLoginRequest,
  // PasskeyLoginChallengeResponse,
} from '@/types/auth.type';
import { base64ToArrayBuffer, arrayBufferToBase64 } from '@/utils/encoding';

import {
  BtnContainer,
  BtnWrapper,
  Container,
  Question,
  SheetBtn,
  Title,
} from './LoginSelector.style';

type LoginSelectorProps = {
  onSelectPassword: () => void;
  onSelectFinger: () => void;
};

const LoginSelector = ({  onSelectPassword }: LoginSelectorProps) => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const handleSelectPin = async () => {

    alert('간편 비밀번호 기능은 현재 개발 중입니다.');
  };


const handleSelectFinger = async () => {
  try {

    console.log('현재 user 상태:', user);
    console.log('user.email:', user?.email);
    if (!user?.email) {
      alert('사용자 정보가 없습니다. 다시 로그인해주세요.');
      router.push('/login'); // 로그인 페이지 경로에 맞게 수정
      return;
    }

    // 패스키 등록 여부 확인 (등록 안 되어 있으면 등록 페이지 이동)
    const isRegistered = await checkPasskeyRegistered();
    if (!isRegistered) {
      alert('패스키가 등록되어 있지 않습니다. 등록 페이지로 이동합니다.');
      router.push('/fido2/register');
      return;
    }

    const challengeData = await getPasskeyLoginChallenge({ email: user.email });

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge: base64ToArrayBuffer(challengeData.challenge),
      rpId: challengeData.rpId,
      allowCredentials: challengeData.allowedCredentialIds.map((cred) => ({
        id: base64ToArrayBuffer(cred.id), // 객체에서 id 꺼내서 변환
        type: 'public-key',
      })),
      timeout: 60000,
      userVerification: 'preferred',
    };

    const credential = (await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    })) as PublicKeyCredential;

    const assertionResponse = credential.response as AuthenticatorAssertionResponse;

    const passkeyData: PasskeyAuthentication = {
      credentialId: credential.id,
      authenticatorData: arrayBufferToBase64(assertionResponse.authenticatorData),
      clientDataJSON: arrayBufferToBase64(assertionResponse.clientDataJSON),
      signature: arrayBufferToBase64(assertionResponse.signature),
    };

    const passkeyLoginRequest: PasskeyLoginRequest = {
      email: user.email,
      challenge: challengeData.challenge,
      authMethod: 'PASSKEY', // enum 문자열로 교체
      deviceInfo: navigator.userAgent,
      passkeyData,
      rawId: arrayBufferToBase64(credential.rawId),
    };

    const response = await loginWithPasskey(passkeyLoginRequest);

    console.log('로그인 성공:', response);
    alert('로그인 성공!');
    router.push('/');
  } catch (error) {
    console.error('지문 인증 실패:', error);
    alert('지문 인증에 실패했습니다.');
  }
};


  return (
    <Container>
      <Title>
        반가워요!
        <br />
        로그인을 진행할게요
      </Title>
      <BottomSheet isOpen={true}>
        <Question>어떤 방법으로 로그인할까요?</Question>
        <BtnWrapper>
          <SheetBtn onClick={handleSelectPin}>
            <BtnContainer>
              <Image src={'/imgs/lock.svg'} width={36} height={36} alt="간편 비밀번호" />
              간편 비밀번호
            </BtnContainer>
          </SheetBtn>
          <SheetBtn onClick={handleSelectFinger}>
            <BtnContainer>
              <Image src={'/icons/finger_36.svg'} width={36} height={36} alt="지문" />
              지문 인증
            </BtnContainer>
          </SheetBtn>
          <SheetBtn onClick={onSelectPassword}>
            <BtnContainer>
              <Image src={'/icons/webee_36.svg'} width={36} height={36} alt="일반 로그인" />
              일반 로그인
            </BtnContainer>
          </SheetBtn>
        </BtnWrapper>
      </BottomSheet>
    </Container>
  );
};

export default LoginSelector;