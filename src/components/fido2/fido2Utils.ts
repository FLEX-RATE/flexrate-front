// components/fido2/fido2Utils.ts
import { Fido2RegistrationResponse } from './fido2Type';

export async function registerPasskey(): Promise<void> {
  if (!window.PublicKeyCredential) {
    throw new Error('이 브라우저는 패스키를 지원하지 않습니다.');
  }

  // 서버에서 등록용 challenge 및 옵션 받아오기 (예시 URL)
  const resp = await fetch('/api/fido2/register/request', {
    method: 'POST',
  });
  if (!resp.ok) throw new Error('등록 요청 실패');

  const options: PublicKeyCredentialCreationOptions = await resp.json();

  // ArrayBuffer가 필요한 필드 변환 (예: challenge, user.id)
  options.challenge = base64ToArrayBuffer(options.challenge as unknown as string);
  if (options.user?.id) {
    options.user.id = base64ToArrayBuffer(options.user.id as unknown as string);
  }

  // WebAuthn 등록 호출
  const credential = (await navigator.credentials.create({
    publicKey: options,
  })) as PublicKeyCredential;

  if (!credential) throw new Error('패스키 등록이 취소되었습니다.');

  // 클라이언트 데이터 전송용 변환
  const clientDataJSON = arrayBufferToBase64(credential.response.clientDataJSON);
  const attestationObject = arrayBufferToBase64(
    (credential.response as AuthenticatorAttestationResponse).attestationObject,
  );

  // 서버에 등록 완료 데이터 전송
  const verifyResp = await fetch('/api/fido2/register/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: credential.id,
      rawId: arrayBufferToBase64(credential.rawId),
      type: credential.type,
      clientDataJSON,
      attestationObject,
    }),
  });
  if (!verifyResp.ok) throw new Error('패스키 등록 검증 실패');
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