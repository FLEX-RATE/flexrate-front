export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import {
  fetchMeSSR,
  fetchMainSummarySSR,
  fetchInterestCurrentSSR,
} from '@/queries/fetchers.server';
import { qk } from '@/queries/keys';

import ClientHome from './ClientHome';

const Home = async () => {
  const qc = new QueryClient();

  const me = await fetchMeSSR().catch(() => null);
  if (me?.role && /\bADMIN\b/i.test(me.role)) {
    redirect('/admin/customer-management');
  }

  await Promise.all([
    qc.prefetchQuery({ queryKey: qk.me, queryFn: fetchMeSSR, staleTime: 60_000 }).catch(() => {}),
    qc
      .prefetchQuery({ queryKey: qk.mainSummary, queryFn: fetchMainSummarySSR, staleTime: 60_000 })
      .catch(() => {}),
    qc
      .prefetchQuery({
        queryKey: qk.interestCurrent,
        queryFn: fetchInterestCurrentSSR,
        staleTime: 60_000,
      })
      .catch(() => {}),
  ]);

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ClientHome />
    </HydrationBoundary>
  );
};

export default Home;
