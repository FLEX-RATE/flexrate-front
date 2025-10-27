import { redirect } from 'next/navigation';

import { fetchMeSSR } from '@/queries/fetchers.server';

import ClientCustomerManagement from './ClientCustomerManagement';

export const dynamic = 'force-dynamic';

const CustomerManagementPage = async () => {
  const me = await fetchMeSSR().catch(() => null);

  if (me?.role !== 'ADMIN') {
    redirect('/');
  }

  return <ClientCustomerManagement />;
};

export default CustomerManagementPage;
