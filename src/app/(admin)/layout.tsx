import DesktopGlobalStyle from '@/styles/DesktopGlobalStyle/DesktopGlobalStyle';

const AdminGroupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DesktopGlobalStyle />
      {children}
    </>
  );
};

export default AdminGroupLayout;
