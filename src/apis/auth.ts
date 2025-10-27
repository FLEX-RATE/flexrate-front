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
} from '@/types/auth.type';

import { apiClient } from './client';

/**
 * 인증 관련 API
 */

// 마이페이지 정보 조회 API
export const getMyPageUser = async () => {
  const { data } = await apiClient.get(`/api/members/mypage`);
  return data;
};

// 회원가입 API는 공통 인스턴스 사용
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
export const patchEmailChange = async (email: string) => {
  const { data } = await apiClient.patch(`/api/members/mypage`, { email });
  return data;
};

// 소비성향 조회
export const getConsumptionType = async (): Promise<ConsumptionTypeKey> => {
  const response = await apiClient.get<ConsumptionTypeResponse>('/api/auth/consumption-type');
  return response.data.consumptionType;
};

// 로그인 API
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post('/api/auth/login/password', data);
  return response.data;
};

// PIN 등록 API
export const registerPin = async (data: { pin: string }): Promise<string> => {
  const res = await apiClient.post('/api/auth/login/pin/register', data);
  return res.data;
};

// 로그인 PIN API
export const loginWithPin = async (data: { pin: string }): Promise<LoginResponse> => {
  const res = await apiClient.post('/api/auth/login/pin', data);
  return res.data;
};

// PIN 등록여부 조회 API
export const checkPinRegistered = async (): Promise<boolean> => {
  const res = await apiClient.get<boolean>('/api/auth/login/pin/registered');
  return res.data;
};

// PIN 검증 API
export const verifyPin = async (pin: string): Promise<boolean> => {
  const res = await apiClient.post<boolean>('/api/auth/pin/verify', { pin });
  return res.data;
};

// 토큰 재발급 API
export const postAuthToken = async () => {
  await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/token`,
    {},
    { withCredentials: true }
  );
};

// 로그아웃 API
export const logout = async () => {
  const { data } = await apiClient.post('/api/auth/logout', {});
  return data;
};
