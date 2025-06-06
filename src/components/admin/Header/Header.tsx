import Image from 'next/image';

import Logo from '@/assets/img/logo(blue).png';
import { useInitUser } from '@/hooks/useInitUser';
import { useLogout } from '@/hooks/useLogout';
import { useUserStore } from '@/stores/userStore';

import {
  EmailBox,
  HeaderRightContainer,
  HeaderWrapper,
  LogoContainer,
  LogoSmallText,
  LogoutBtn,
} from './Header.style';

const Header = () => {
  useInitUser();
  const user = useUserStore((state) => state.user);
  const { mutate: logoutMutate } = useLogout();

  const handleLogout = () => {
    logoutMutate();
  };

  return (
    <HeaderWrapper>
      <LogoContainer>
        <Image src={Logo} alt="FlexRate Logo" width={120} height={40} />
        <LogoSmallText>Admin</LogoSmallText>
      </LogoContainer>
      <HeaderRightContainer>
        <LogoutBtn onClick={handleLogout}>로그아웃</LogoutBtn>
        {user ? <EmailBox>{user?.email}</EmailBox> : <></>}
      </HeaderRightContainer>
    </HeaderWrapper>
  );
};

export default Header;
