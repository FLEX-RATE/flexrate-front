import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:8080';

// axios 인스턴스 생성 (공통 설정 포함)
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 필요시 인터셉터 등 추가 가능
// apiClient.interceptors.request.use(config => { ... });

/**
 * 로그인 유저 정보 반환
 */
export async function getMyPageUser(token: string) {
  const { data } = await apiClient.get('/api/members/mypage', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

// 이메일 인증번호 요청
export interface SendEmailRequest {
  email: string;
}
export async function sendEmailVerificationCode(data: SendEmailRequest): Promise<void> {
  await apiClient.post('/api/auth/email/send', data);
}

// 이메일 인증번호 검증
export interface VerifyEmailCodeRequest {
  email: string;
  code: string;
}
export async function verifyEmailCode(data: VerifyEmailCodeRequest): Promise<void> {
  await apiClient.post('/api/auth/email/verification', data);
}

export interface SignupRequest {
  email: string;
  password: string;
  sex: 'MALE' | 'FEMALE';
  simplePassword: string;
  name: string;
  birthDate: string;
  consumptionType: string;
  consumeGoal: string;
}

export interface SignupResponse {
  userId: number;
  email: string;
}
export async function signupUser(data: SignupRequest): Promise<SignupResponse> {
  const response = await apiClient.post('/api/auth/signup/password', data);
  return response.data;
}

export interface SimpleLoginRequest {
  email: string;
  simplePassword: string;
}

export interface SimpleLoginResponse {
  accessToken: string;
  user: {
    name: string;
    email: string;
    consumeGoal: string;
    consumptionType: string;
  };
}

export async function simpleLogin(data: SimpleLoginRequest): Promise<SimpleLoginResponse> {
  const response = await apiClient.post('/api/auth/login/simple-password', data);
  return response.data;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    name: string;
    email: string;
    consumeGoal: string;
    consumptionType: string;
  };
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post('/api/auth/login/password', data);
  return response.data;
}
