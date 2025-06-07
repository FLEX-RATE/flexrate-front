import { getFido2RegisterChallenge, verifyFido2Register } from '@/apis/auth';
import {
  transformResponseToRequest,
  Fido2RegistrationResponse,
} from '@/apis/fido2Type';

// base64url → base64
function base64urlToBase64(base64url: string): string {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return base64;
}

// base64url → ArrayBuffer
export function base64ToArrayBuffer(base64url: string): ArrayBuffer {
  if (typeof window === 'undefined' || typeof atob === 'undefined') {
    throw new Error('base64ToArrayBuffer는 브라우저 환경에서만 동작합니다.');
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

// ArrayBuffer → base64
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// base64 → base64url
function base64ToBase64url(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ArrayBuffer → base64url
export function arrayBufferToBase64url(buffer: ArrayBuffer): string {
  const base64 = arrayBufferToBase64(buffer);
  return base64ToBase64url(base64);
}

export async function registerPasskey(): Promise<void> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    throw new Error('이 브라우저는 패스키를 지원하지 않습니다.');
  }

  // 서버에서 WebAuthn 등록 옵션 받아오기
  const options = await getFido2RegisterChallenge();

  if (!options.challenge || typeof options.challenge !== 'string') {
    throw new Error('서버에서 받은 challenge 값이 유효하지 않습니다.');
  }

  if (!options.user?.id || typeof options.user.id !== 'string') {
    throw new Error('서버에서 받은 user.id 값이 유효하지 않습니다.');
  }

  // challenge, user.id 를 ArrayBuffer로 변환
  const publicKey: PublicKeyCredentialCreationOptions = {
    ...options,
    challenge: base64ToArrayBuffer(options.challenge),
    user: {
      ...options.user,
      id: base64ToArrayBuffer(options.user.id),
    },
  };

  // 사용자 디바이스에서 패스키 생성
  const credential = (await navigator.credentials.create({
    publicKey,
  })) as PublicKeyCredential;

  if (!credential) {
    throw new Error('패스키 등록이 취소되었습니다.');
  }

  const attestationResponse = credential.response as AuthenticatorAttestationResponse;

  // base64url로 인코딩
  const rawId = arrayBufferToBase64url(credential.rawId);
  const clientDataJSON = arrayBufferToBase64url(attestationResponse.clientDataJSON);
  const attestationObject = arrayBufferToBase64url(attestationResponse.attestationObject);

  // Fido2RegistrationResponse 형태로 구성
  const fido2Response: Fido2RegistrationResponse = {
    id: credential.id,
    rawId,
    type: credential.type,
    response: {
      clientDataJSON,
      attestationObject,
    },
  };

  // 변환 함수 사용 → 서버 DTO에 맞는 형태로 전환
  const requestDto = transformResponseToRequest(credential);

  // 서버로 등록 요청
  await verifyFido2Register(requestDto);
}
