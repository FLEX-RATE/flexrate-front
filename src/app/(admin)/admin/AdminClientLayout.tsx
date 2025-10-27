'use client';

import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import AdminLayout from '@/components/admin/AdminLayout/AdminLayout';
import { fetchMe } from '@/queries/fetchers.client';
import { qk } from '@/queries/keys';
import { useUserStore } from '@/stores/userStore';
import { mapMeToUser } from '@/utils/mapMeToUser';

const AdminClientLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: me, isInitialLoading } = useQuery({
    queryKey: qk.me,
    queryFn: fetchMe,
    staleTime: 60_000,
  });

  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    if (me === undefined) return;
    setUser(me ? mapMeToUser(me) : null);
  }, [me, setUser]);

  if (isInitialLoading) return <div style={{ padding: 16 }}>권한 확인 중…</div>;
  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminClientLayout;
