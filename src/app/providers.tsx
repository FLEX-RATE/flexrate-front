'use client';
import { ReactNode, useLayoutEffect, useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useUserStore, type User } from '@/stores/userStore';

const MeHydrator = ({ initialUser }: { initialUser?: User | null }) => {
  const setUser = useUserStore((s) => s.setUser);
  useLayoutEffect(() => {
    if (typeof initialUser !== 'undefined') setUser(initialUser ?? null);
  }, [initialUser, setUser]);
  return null;
};

export const Providers = ({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: User | null;
}) => {
  const [qc] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={qc}>
      <MeHydrator initialUser={initialUser} />
      {children}
    </QueryClientProvider>
  );
};
