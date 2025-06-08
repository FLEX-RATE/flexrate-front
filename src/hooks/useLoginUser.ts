import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { loginUser } from '@/apis/auth';
import { getCreditScore, getCreditStatus } from '@/apis/credit';
import { getCustomerLoanStatus } from '@/apis/customer';
import { authSchemas } from '@/schemas/auth.schema';
import { useUserStore } from '@/stores/userStore';

export type LoginFormValues = z.infer<typeof authSchemas.login>;

export const useLoginUser = () => {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const setAccessToken = useUserStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: async (form: LoginFormValues) => {
      const loginRes = await loginUser(form);

      setAccessToken(loginRes.accessToken);

      const [loanStatus, creditResult] = await Promise.all([
        getCustomerLoanStatus(loginRes.accessToken),
        getCreditStatus(loginRes.accessToken),
      ]);

      let creditScore = null;
      if (creditResult.creditScoreStatus) {
        creditScore = await getCreditScore(loginRes.accessToken);
      }

      return {
        username: loginRes.username,
        role: loginRes.role,
        email: loginRes.email,
        recentLoanStatus: loanStatus,
        hasCreditScore: creditResult.creditScoreStatus,
        creditScore: creditScore?.creditScore ?? 0,
      };
    },

    onSuccess: (fullUser) => {
      setUser(fullUser);
      if (fullUser.role === 'ADMIN') {
        router.push('/admin/customer-management');
      } else {
        router.push('/');
      }
    },

    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('로그인 실패:', error);
        alert('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        console.error('알 수 없는 오류:', error);
      }
    },
  });
};
