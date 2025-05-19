import { useMutation } from '@tanstack/react-query';
import { signupUser, SignupRequest, SignupResponse } from '@/apis/auth';

export function useSignup() {
  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: signupUser,
    onSuccess: (data) => {
      console.log('회원가입 성공:', data);
      // 성공 시 추가 동작이 필요하면 여기서 처리
    },
    onError: (error) => {
      console.error('회원가입 실패:', error);
      // 에러 핸들링 추가 가능
    },
  });
}
