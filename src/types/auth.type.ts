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
