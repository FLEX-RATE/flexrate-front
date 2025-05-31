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
export const getMyPageUser = async (token: string) => {
  const { data } = await apiClient.get(`/api/members/mypage`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

// 회원가입 API는 공통 인스턴스 사용
export const postSignupUser = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await apiClient.post('/api/auth/signup/password', data);
  console.log('Signup tokens:', response.data.accessToken, response.data.refreshToken);
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

// 이메일 변경 요청 - 토큰 헤더 필요해서 직접 호출
export const patchEmailChange = async (token: string, email: string) => {
  const { data } = await apiClient.patch(
    `/api/members/mypage`,
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

// 로그인 API
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post('/api/auth/login/password', data, {
    withCredentials: true,
  });
  return response.data;
};

// PIN 등록 API
interface PinRegisterRequest {
  pin: string;
}

export const registerPin = async (data: PinRegisterRequest): Promise<string> => {
  const token = localStorage.getItem('accessToken');
  console.log('Register PIN token:', token);
  if (!token) {
    throw new Error('Access token is missing, 로그인 필요');
  }
  const response = await apiClient.post(
    '/api/auth/login/pin/register',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// 액세스 토큰 재발급 API
export const postAuthToken = async () => {
  const response = await apiClient.post<{ accessToken: string }>(
    '/api/auth/token',
    {},
    {
      withCredentials: true,
    }
  );
  return response.data.accessToken;
};

// 로그인 PIN API
export const loginWithPin = async (data: { pin: string }): Promise<LoginResponse> => {
  const token = localStorage.getItem('accessToken');
  const response = await apiClient.post<LoginResponse>(
    '/api/auth/login/pin',
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// PIN 등록여부 조회 API
export const checkPinRegistered = async (): Promise<boolean> => {
  const token = localStorage.getItem('accessToken');
  console.log('서버로 엑세스토큰 전송:', token);

  const response = await apiClient.get<boolean>('/api/auth/login/pin/registered', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;  // true 혹은 false 직접 반환
};

// 로그아웃 API
export const logout = async (token: string) => {
  const { data } = await apiClient.post(
    '/api/auth/logout',
    {},
    { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
  );
  return data;
};
