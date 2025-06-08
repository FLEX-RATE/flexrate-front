import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { logout } from '@/apis/auth';
import { useUserStore } from '@/stores/userStore';

export const useLogout = () => {
  const router = useRouter();
  const token = useUserStore((state) => state.accessToken);
  return useMutation({
    mutationFn: async () => {
      if (token) {
        await logout(token);
      }
    },
    onSettled: () => {
      localStorage.removeItem('accessToken');
      useUserStore.getState().clearUser();
      router.replace('/');
    },
  });
};
