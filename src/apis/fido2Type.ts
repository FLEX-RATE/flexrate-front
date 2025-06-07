// components/fido2/fido2Types.ts

import { arrayBufferToBase64url } from './fido2Utils';

export function transformResponseToRequest(
  credential: PublicKeyCredential
): PasskeyRegistrationRequest {
  const response = credential.response as AuthenticatorAttestationResponse;

  return {
    credentialId: credential.id,
    rawId: arrayBufferToBase64url(credential.rawId),
    clientDataJSON: arrayBufferToBase64url(response.clientDataJSON),
    attestationObject: arrayBufferToBase64url(response.attestationObject),
    deviceInfo: navigator.userAgent,
    publicKey: '', // 필요 시 채우기
    signCount: 0,  // 필요 시 채우기
    authenticatorData: '',
    signature: '',
  };
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
