import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { postSignupUser } from '@/apis/auth';

export const usePostSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: postSignupUser,
    onSuccess: (data) => {
      if (data?.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        console.log('로컬스토리지에 저장됨:', data.accessToken);
      } else {
        console.warn('회원가입 응답에 엑세스토큰이 없습니다.');
      }
      router.push('/auth/login');
    },
    onError: (error) => {
      console.error('회원가입 실패', error);
      alert('회원가입에 실패했어요. 다시 시도해주세요.');
    },
  });
};