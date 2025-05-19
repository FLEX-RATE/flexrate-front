/**
 * Axios 인스턴스 설정 파일
 * (기본 API 베이스 URL, 인터셉터 등 공통 설정 적용)
 */


import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axios;