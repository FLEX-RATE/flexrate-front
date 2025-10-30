'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import Header from '@/components/admin/Header/Header';
import CharacterLoading from '@/components/CharacterLoading/CharacterLoading';
import { useMe } from '@/hooks/useMe';
import { useUserStore } from '@/stores/userStore';
import { mapMeToUser } from '@/utils/mapMeToUser';

import Sidebar from '../Sidebar/Sidebar';

import { AdminBody, AdminWrapper } from './AdminLayout.style';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data: me, isLoading, isFetching } = useMe();

  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    if (me) setUser(mapMeToUser(me));
  }, [me, setUser]);

  if (isLoading || isFetching) return <CharacterLoading />;
  if (!me) {
    router.replace('/auth/login');
    return null;
  }
  if ((me.role ?? 'MEMBER') !== 'ADMIN') {
    router.replace('/not-found');
    return null;
  }

  return (
    <AdminWrapper>
      <Header />
      <AdminBody>
        <Sidebar />
        {children}
      </AdminBody>
    </AdminWrapper>
  );
};

export default AdminLayout;
