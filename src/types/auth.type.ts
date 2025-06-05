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
}

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
  credentialId: string;      // Base64url 인코딩된 credential ID
  publicKey: string;         // PEM 형식 공개키
  signCount: number;         // signcount 서명 횟수
  deviceInfo: string;        // 디바이스 장치 접속 정보
  authenticatorData: string; // Base64url 인코딩된 authenticatorData
  clientDataJSON: string;    // Base64url 인코딩된 clientDataJSON
  signature: string;         // Base64url 인코딩된 서명
}

export interface PasskeyLoginChallengeRequest {
  email: string;             // 이메일 (필수입력!)
}

export interface PasskeyLoginChallengeResponse {
  challenge: string;
  rpId: string;
  userHandle: string;
  allowedCredentialIds: string[];
}

export interface PasskeyLoginRequest {
  email: string;
  passkeyData: PasskeyAuthentication;
  authMethod: string;        // AuthMethod enum 문자열로 받을 예정
  deviceInfo: string;
  challenge: string;
}