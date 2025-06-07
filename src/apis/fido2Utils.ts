// src/apis/fido2Utils.ts
import { getFido2RegisterChallenge, verifyFido2Register } from '@/apis/auth';

// base64url base64 변환 함수
function base64urlToBase64(base64url: string): string {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return base64;
}

// base64url 문자열을 ArrayBuffer로 변환
export function base64ToArrayBuffer(base64url: string): ArrayBuffer {
  if (typeof window === 'undefined' || typeof atob === 'undefined') {
    throw new Error('base64ToArrayBuffer 함수는 브라우저 환경에서만 실행해야 합니다.');
  }

  const base64 = base64urlToBase64(base64url);
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// ArrayBuffer를 base64 문자열로 변환 (변경 없음)
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function registerPasskey(): Promise<void> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    throw new Error('이 브라우저는 패스키를 지원하지 않습니다.');
  }

  // 서버에서 challenge 및 옵션 받아오기
  const options = await getFido2RegisterChallenge();

  console.log('registerPasskey - options:', options);
  console.log('challenge:', options.challenge);
  console.log('user.id:', options.user?.id);

  if (!options.challenge || typeof options.challenge !== 'string') {
    throw new Error('서버에서 받은 challenge 값이 유효하지 않습니다.');
  }

  if (!options.user?.id || typeof options.user.id !== 'string') {
    throw new Error('서버에서 받은 user.id 값이 유효하지 않습니다.');
  }

  // 기존 options를 복제 후 타입 명확히 하기
  const publicKey: PublicKeyCredentialCreationOptions = {
    ...options,
    challenge: base64ToArrayBuffer(options.challenge),
    user: {
      ...options.user,
      id: base64ToArrayBuffer(options.user.id),
    },
  };

  // WebAuthn 생성 요청
  const credential = (await navigator.credentials.create({
    publicKey,
  })) as PublicKeyCredential;

  if (!credential) throw new Error('패스키 등록이 취소되었습니다.');

  const attestationResponse = credential.response as AuthenticatorAttestationResponse;

  // 서버 전송용 데이터 base64 인코딩
  const rawId = arrayBufferToBase64(credential.rawId);
  const clientDataJSON = arrayBufferToBase64(attestationResponse.clientDataJSON);
  const attestationObject = arrayBufferToBase64(attestationResponse.attestationObject);
  const deviceInfo = navigator.userAgent;


  console.log('verifyFido2Register 호출 직전 데이터:', {
  credentialId: credential.id,
  rawId,
  clientDataJSON,
  attestationObject,
  deviceInfo,
  });

  // 등록 검증 API 호출 (rawId 포함)
  await verifyFido2Register({
  credentialId: credential.id,
  rawId,
  clientDataJSON,
  attestationObject,
  deviceInfo,
  });
}