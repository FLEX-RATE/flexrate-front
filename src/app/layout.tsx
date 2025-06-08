import type { Metadata } from 'next';

import '@/app/globals.css';
import { EmotionProvider } from '@/components/EmotionProvider/EmotionProvider';
import GlobalStyleProvider from '@/components/GlobalStyleProvider/GlobalStyleProvider';
import { pretendard } from '@/fonts/pretendard';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'FlexRate',
  description: '라이프스타일을 통해 평가받는 신용대출, FlexRate',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko" className={pretendard.variable}>
      <head>
        <link rel="preconnect" href="http://localhost:8080" />
        <link rel="dns-prefetch" href="http://localhost:8080" />
        <link
          rel="preload"
          href="@/fonts/PretendardVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <GlobalStyleProvider>
          <EmotionProvider>
            <Providers>{children}</Providers>
          </EmotionProvider>
        </GlobalStyleProvider>
      </body>
    </html>
  );
};

export default RootLayout;
