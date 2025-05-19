import { useMutation } from '@tanstack/react-query';
import { loginUser, LoginRequest, LoginResponse } from '@/apis/auth';
import { useUserStore } from '@/stores/userStore';

export function useLogin() {
  const setUser = useUserStore((state) => state.setUser);

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // 토큰 저장
      localStorage.setItem('accessToken', data.accessToken);
      // 유저 상태 업데이트
      setUser(data.user);
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
      // 필요시 추가 에러 처리
    },
  });
}
