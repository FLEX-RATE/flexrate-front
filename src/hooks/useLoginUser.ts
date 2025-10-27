import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { loginUser } from '@/apis/auth';
import { getCreditScore, getCreditStatus } from '@/apis/credit';
import { getCustomerLoanStatus } from '@/apis/customer';
import { qk } from '@/queries/keys';
import { authSchemas } from '@/schemas/auth.schema';
import { useUserStore } from '@/stores/userStore';

export type LoginFormValues = z.infer<typeof authSchemas.login>;

export const useLoginUser = () => {
  const router = useRouter();
  const qc = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (form: LoginFormValues) => {
      const loginRes = await loginUser(form);

      const [loanStatus, creditResult] = await Promise.all([
        getCustomerLoanStatus(),
        getCreditStatus(),
      ]);

      let creditScore = null;
      if (creditResult.creditScoreStatus) {
        creditScore = await getCreditScore();
      }

      const fullUser = {
        username: loginRes.username,
        role: loginRes.role,
        email: loginRes.email,
        recentLoanStatus: loanStatus,
        hasCreditScore: creditResult.creditScoreStatus,
        creditScore: creditScore?.creditScore ?? 0,
      };

      return fullUser;
    },

    onSuccess: (fullUser) => {
      qc.setQueryData(qk.me, fullUser);
      qc.removeQueries({ queryKey: qk.mainSummary });
      qc.removeQueries({ queryKey: qk.interestCurrent });

      setUser(fullUser);

      console.log('[Login Success]', fullUser);

      if (fullUser.role === 'ADMIN') {
        router.replace('/admin/customer-management');
      } else {
        router.replace('/');
      }
    },

    onError: (error: unknown) => {
      console.error('로그인 실패:', error);
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    },
  });
};
