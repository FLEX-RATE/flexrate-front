import NotFound from '@/app/not-found';
import Header from '@/components/admin/Header/Header';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useUserStore } from '@/stores/userStore';

import Sidebar from '../Sidebar/Sidebar';

import { AdminBody, AdminWrapper } from './AdminLayout.style';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  useAuthGuard('ADMIN');

  const user = useUserStore((state) => state.user);

  if (!user) return null;

  if (user.role !== 'ADMIN') {
    return <NotFound />;
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
