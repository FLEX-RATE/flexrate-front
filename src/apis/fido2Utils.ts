// components/fido2/fido2Utils.ts
import { apiClient } from '@/apis/client'; // ← 경로는 실제 위치에 따라 조정
import { Fido2RegistrationResponse } from './fido2Type';

export async function registerPasskey(): Promise<void> {
  if (!window.PublicKeyCredential) {
    throw new Error('이 브라우저는 패스키를 지원하지 않습니다.');
  }

  // 서버에서 등록용 challenge 및 옵션 받아오기
  const { data: options } = await apiClient.post<PublicKeyCredentialCreationOptions>(
    '/api/fido2/register/request'
  );

  // challenge, user.id base64 → ArrayBuffer 변환
  if (typeof options.challenge === 'string') {
    options.challenge = base64ToArrayBuffer(options.challenge);
  }
  if (options.user?.id) {
    options.user.id = base64ToArrayBuffer(options.user.id as unknown as string);
  }

  // WebAuthn 등록
  const credential = (await navigator.credentials.create({
    publicKey: options,
  })) as PublicKeyCredential;

  if (!credential) throw new Error('패스키 등록이 취소되었습니다.');

  const attestationResponse = credential.response as AuthenticatorAttestationResponse;

  const rawId = arrayBufferToBase64(credential.rawId);
  const clientDataJSON = arrayBufferToBase64(attestationResponse.clientDataJSON);
  const attestationObject = arrayBufferToBase64(attestationResponse.attestationObject);
  const deviceInfo = navigator.userAgent;

  // 서버에 등록 검증 요청
  await apiClient.post('/api/fido2/register/verify', {
    credentialKey: credential.id,
    rawId,
    clientDataJSON,
    attestationObject,
    deviceInfo,
  });
}

// 유틸 함수: base64 <-> ArrayBuffer 변환
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
