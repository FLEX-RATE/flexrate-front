import axios from 'axios';

import { ConsumptionTypeKey } from '@/constants/auth.constant';
import {
  ConsumptionTypeResponse,
  LoginRequest,
  LoginResponse,
  SendEmailRequest,
  SignupRequest,
  SignupResponse,
  VerifyEmailCodeRequest,
  PasskeyRequest,
  PasskeyLoginChallengeRequest,
  PasskeyLoginChallengeResponse,
  PasskeyRegisterChallengeResponse,
  PasskeyLoginRequest,
} from '@/types/auth.type';


import { apiClient } from './client';

/**
 * 인증 관련 API 함수 모음
 */

// 마이페이지 정보 조회
export const getMyPageUser = async () => {
  const { data } = await apiClient.get('/api/members/mypage');
  return data;
};

// 회원가입
export const postSignupUser = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await apiClient.post('/api/auth/signup/password', data);
  return response.data;
};

// 이메일 인증 요청
export const postSendEmailVerificationCode = async (data: SendEmailRequest): Promise<void> => {
  await apiClient.post('/api/auth/email/send', data);
};

// 이메일 인증번호 검증
export const postVerifyEmailCode = async (data: VerifyEmailCodeRequest): Promise<void> => {
  await apiClient.post('/api/auth/email/verification', data);
};

// 이메일 변경 요청
export const patchEmailChange = async (token: string, email: string) => {
  const { data } = await apiClient.patch(
    '/api/members/mypage',
    { email },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

// 소비성향 조회
export const getConsumptionType = async (): Promise<ConsumptionTypeKey> => {
  const response = await apiClient.get<ConsumptionTypeResponse>('/api/auth/consumption-type');
  return response.data.consumptionType;
};

// 로그인
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post('/api/auth/login/password', data, {
    withCredentials: true,
  });
  return response.data;
};

// PIN 등록
export const registerPin = async (data: { pin: string }): Promise<string> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('Access token is missing, 로그인 필요');
  const response = await apiClient.post('/api/auth/login/pin/register', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 액세스 토큰 재발급
export const postAuthToken = async () => {
  const response = await axios.post<{ accessToken: string }>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/token`,
    {},
    { withCredentials: true }
  );
  return response.data.accessToken;
};

// PIN 로그인
export const loginWithPin = async (data: { pin: string }): Promise<LoginResponse> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('Access token is missing');
  const response = await apiClient.post<LoginResponse>('/api/auth/login/pin', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// PIN 등록여부 조회
export const checkPinRegistered = async (): Promise<boolean> => {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;
  const response = await apiClient.get<boolean>('/api/auth/login/pin/registered', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 로그아웃
export const logout = async (token: string) => {
  const { data } = await apiClient.post(
    '/api/auth/logout',
    {},
    { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
  );
  return data;
};

// PIN 검증
export const verifyPin = async (pin: string): Promise<boolean> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('Access token is missing');
  const response = await apiClient.post<boolean>(
    '/api/auth/pin/verify',
    { pin },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// 패스키 관련 API

// 패스키 등록 여부 조회
export const checkPasskeyRegistered = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    const response = await apiClient.get('/api/auth/fido2/exists', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('패스키 등록 여부 조회 실패:', error);
    return false;
  }
};

// FIDO2 패스키 등록용 챌린지 요청
export const getFido2RegisterChallenge = async (): Promise<PasskeyRegisterChallengeResponse> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('로그인 필요');
  const response = await apiClient.get<PasskeyRegisterChallengeResponse>('/api/auth/fido2/register/options', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('typeof response.data:', typeof response.data);
  console.log('response.data:', response.data);
  return response.data;
};

// FIDO2 패스키 등록 검증
export const verifyFido2Register = async (data: PasskeyRequest): Promise<void> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('로그인 필요');
  await apiClient.post('/api/auth/fido2/register/verify', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 패스키 로그인 챌린지 요청
export const getPasskeyLoginChallenge = async ( data: PasskeyLoginChallengeRequest ): Promise<PasskeyLoginChallengeResponse> => {
  const response = await apiClient.post('/api/auth/login/passkey/challenge', data);
  return response.data;
};

// 패스키 로그인 요청
export const loginWithPasskey = async ( data: PasskeyLoginRequest ): Promise<LoginResponse> => {
  const response = await apiClient.post('/api/auth/login/passkey', data);
  return response.data;
};