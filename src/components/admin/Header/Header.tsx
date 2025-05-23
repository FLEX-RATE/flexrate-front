import Image from 'next/image';

import Logo from '@/assets/img/logo(green).png';
import { useInitUser } from '@/hooks/useInitUser';
import { useUserStore } from '@/stores/userStore';

import {
  EmailBox,
  HeaderRightContainer,
  HeaderWrapper,
  HomePageButton,
  LogoContainer,
  LogoSmallText,
} from './Header.style';

const Header = () => {
  useInitUser();
  const user = useUserStore((state) => state.user);
  return (
    <HeaderWrapper>
      <LogoContainer>
        <Image src={Logo} alt="FlexRate Logo" width={120} height={40} />
        <LogoSmallText>Admin</LogoSmallText>
      </LogoContainer>
      <HeaderRightContainer>
        <HomePageButton>FlexRate 홈페이지</HomePageButton>
        {user ? <EmailBox>{user?.email}</EmailBox> : <></>}
      </HeaderRightContainer>
    </HeaderWrapper>
  );
};

export default Header;
