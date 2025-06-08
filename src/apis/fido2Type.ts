import { arrayBufferToBase64url } from './fido2Utils';

// attestationObject에서 공개키 추출하는 함수
function extractPublicKey(attestationObject: ArrayBuffer): string {
  // 실제 구현에서 attestationObject는 다양한 정보와 함께 공개키가 포함되어 있을 수 있습니다.
  // 여기서는 예시로 공개키를 직접 추출한다고 가정합니다.
  // WebAuthn의 attestationObject에는 attestationData와 같은 정보가 포함되므로, 공개키를 추출하는 로직을 정확하게 구현해야 합니다.
  return arrayBufferToBase64url(attestationObject); // 실제 구현 필요
}

// authenticatorData에서 signCount 추출하는 함수
function extractSignCount(authenticatorData: ArrayBuffer): number {
  const signCountBuffer = authenticatorData.slice(0, 4); // 예시: 첫 4바이트가 signCount일 경우
  const signCount = new DataView(signCountBuffer).getUint32(0);
  return signCount;
}

export function transformResponseToRequest(
  credential: PublicKeyCredential
): PasskeyRegistrationRequest {
  const response = credential.response as AuthenticatorAttestationResponse;

  const attestationObject = response.attestationObject;
  const authenticatorData = response.getAuthenticatorData(); // 인증기기 데이터 가져오기

  // 'signature'를 attestationObject에서 추출하는 방식으로 수정
  // attestationObject에서 서명 추출하는 로직 (예시로 DataView 사용)
  const signature = extractSignatureFromAttestationObject(attestationObject); 

  const publicKey = extractPublicKey(attestationObject);  // 공개키 추출
  const signCount = extractSignCount(authenticatorData);  // 서명 카운트 추출

  // 임시 로그
  const result = {
    credentialId: credential.id,
    rawId: arrayBufferToBase64url(credential.rawId),
    clientDataJSON: arrayBufferToBase64url(response.clientDataJSON),
    attestationObject: arrayBufferToBase64url(attestationObject),
    deviceInfo: navigator.userAgent,
    publicKey, // 실제 공개키 채움
    signCount, // 실제 서명 카운트 채움
    authenticatorData: arrayBufferToBase64url(authenticatorData),  // 인증기기 데이터 채움
    signature: arrayBufferToBase64url(signature),  // 서명 채움
  };

  console.log('transformResponseToRequest 결과:', result);

  return result;

  // return {
  //   credentialId: credential.id,
  //   rawId: arrayBufferToBase64url(credential.rawId),
  //   clientDataJSON: arrayBufferToBase64url(response.clientDataJSON),
  //   attestationObject: arrayBufferToBase64url(attestationObject),
  //   deviceInfo: navigator.userAgent,
  //   publicKey, // 실제 공개키 채움
  //   signCount, // 실제 서명 카운트 채움
  //   authenticatorData: arrayBufferToBase64url(authenticatorData),  // 인증기기 데이터 채움
  //   signature: arrayBufferToBase64url(signature),  // 서명 채움
  // };
}

// attestationObject에서 서명을 추출하는 함수 (예시)
function extractSignatureFromAttestationObject(attestationObject: ArrayBuffer): ArrayBuffer {
  // 실제로는 attestationObject에서 서명을 추출하는 로직을 구현해야 합니다.
  // 예시로, attestationObject의 마지막 바이트들이 서명일 수 있습니다.
  const signatureStart = attestationObject.byteLength - 64; // 예시: 서명이 64바이트라고 가정
  return attestationObject.slice(signatureStart);
}

export interface PasskeyRegistrationRequest {
  credentialId: string;
  rawId: string;
  clientDataJSON: string;
  attestationObject: string;
  deviceInfo: string;
  publicKey: string;
  signCount: number;
  authenticatorData: string;
  signature: string;
}

export interface RegisterVerificationRequest {
  credentialId: string;
  rawId: string;
  clientDataJSON: string;
  attestationObject: string;
  deviceInfo: string;
  publicKey: string;
  signCount: number;
  authenticatorData: string;
  signature: string;
}

export interface Fido2RegistrationResponse {
  id: string;
  rawId: string;
  type: string;
  response: {
    clientDataJSON: string;
    attestationObject: string;
  };
}
