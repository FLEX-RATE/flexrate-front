import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { fetchMeSSR } from '@/queries/fetchers.server';
import { qk } from '@/queries/keys';

import AdminClientLayout from './AdminClientLayout';

export const dynamic = 'force-dynamic';

const AdminServerLayout = async ({ children }: { children: React.ReactNode }) => {
  const qc = new QueryClient();

  const me = await fetchMeSSR();

  if (!me || me.role !== 'ADMIN') notFound();

  await qc.prefetchQuery({ queryKey: qk.me, queryFn: fetchMeSSR }).catch(() => {});
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <AdminClientLayout>{children}</AdminClientLayout>
    </HydrationBoundary>
  );
};

export default AdminServerLayout;
