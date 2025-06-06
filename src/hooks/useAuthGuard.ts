import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useUserStore } from '@/stores/userStore';

export const useAuthGuard = (requiredRole: 'ADMIN' | 'MEMBER') => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user) return;

    if (user.role !== requiredRole) {
      router.replace('/not-found');
    }
  }, [user, requiredRole, router]);
};
