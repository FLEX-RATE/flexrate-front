import { ReactNode } from 'react';

import MobileGlobalStyle from '@/styles/MobileGlobalStyle/MobileGlobalStyle';
import { AppContainer, InnerContainer } from '@/styles/MobileGlobalStyle/MobileGlobalStyle.style';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <MobileGlobalStyle />
      <AppContainer>
        <InnerContainer>{children}</InnerContainer>
      </AppContainer>
    </>
  );
};

export default AppLayout;
