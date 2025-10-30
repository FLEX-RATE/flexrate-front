'use client';

import Image from 'next/image';

import Logo from '@/assets/img/logo(blue).png';
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
  const user = useUserStore((s) => s.user);
  const { mutate: logout } = useLogout();

  return (
    <HeaderWrapper>
      <LogoContainer>
        <Image src={Logo} alt="FlexRate Logo" width={120} height={40} priority />
        <LogoSmallText>Admin</LogoSmallText>
      </LogoContainer>
      <HeaderRightContainer>
        <LogoutBtn onClick={() => logout()}>로그아웃</LogoutBtn>
        {user?.email && <EmailBox>{user.email}</EmailBox>}
      </HeaderRightContainer>
    </HeaderWrapper>
  );
};

export default Header;
