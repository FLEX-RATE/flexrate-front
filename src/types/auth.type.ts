import { ConsumptionTypeKey } from '@/constants/auth.constant';

export interface SignupRequest {
  email: string;
  password: string;
  sex: 'MALE' | 'FEMALE';
  name: string;
  birthDate: string;
  consumptionType: string;
  consumeGoal: string;
  pin?: string;
}

export interface SignupResponse {
  userId: number;
  email: string;
  accessToken: string;
}

export interface SendEmailRequest {
  email: string;
}

export interface VerifyEmailCodeRequest {
  email: string;
  code: string;
}

export interface ConsumptionTypeResponse {
  consumptionType: ConsumptionTypeKey;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  email: string;
  role: 'MEMBER' | 'ADMIN';
}

// --- FIDO2 / Passkey 관련 타입 ---

export interface PasskeyRegisterChallengeResponse {
  challenge: string;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: string; // base64url 인코딩된 userId
    name: string;
    displayName: string;
  };
  pubKeyCredParams: PublicKeyCredentialParameters[];
  timeout?: number;
  attestation?: 'none' | 'direct' | 'indirect';
  authenticatorSelection?: {
    userVerification?: 'required' | 'preferred' | 'discouraged';
    residentKey?: 'required' | 'preferred' | 'discouraged';
    authenticatorAttachment?: 'platform' | 'cross-platform';
  };
}

export interface PasskeyAuthentication {
  credentialId: string;      
  authenticatorData: string; 
  clientDataJSON: string;
  signature: string;
}

export interface PasskeyRequest {
  credentialId: string;
  rawId: string;
  clientDataJSON: string;
  attestationObject: string;
  email?: string;
  deviceInfo: string;
}


export interface PasskeyLoginChallengeRequest {
  email: string;
}

export interface PasskeyRegisterRequest {
  credentialId: string;
  rawId: string;
  clientDataJSON: string;
  attestationObject: string;
  email?: string;
  deviceInfo: string;
}

// AllowedCredential 타입 추가
export interface AllowedCredential {
  id: string;          // base64url 인코딩된 credential ID
  type: string;        // 보통 "public-key"
  transports?: string[];
}

export interface PasskeyLoginChallengeResponse {
  challenge: string;
  rpId: string;
  userHandle: string;
  allowedCredentialIds: AllowedCredential[];
}

export interface PasskeyLoginRequest {
  email: string;
  passkeyData: PasskeyAuthentication;
  authMethod: string;
  deviceInfo: string;
  challenge: string;
  rawId: string;
}