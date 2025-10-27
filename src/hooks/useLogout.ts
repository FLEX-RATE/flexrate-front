'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { apiClient } from '@/apis/client';
import { qk } from '@/queries/keys';
import { useUserStore } from '@/stores/userStore';

export const useLogout = () => {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/api/auth/logout', {});
    },
    onSuccess: () => {
      qc.setQueryData(qk.me, null);
      qc.removeQueries({ queryKey: qk.mainSummary });
      qc.removeQueries({ queryKey: qk.interestCurrent });

      useUserStore.getState().clearUser();

      router.replace('/');
      router.refresh();
    },
    onError: () => {
      qc.setQueryData(qk.me, null);
      useUserStore.getState().clearUser();
      router.replace('/');
      router.refresh();
    },
  });
};
