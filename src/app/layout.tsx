import type { Metadata } from 'next';

import { fetchMeSSR } from '@/queries/fetchers.server';
import { Me } from '@/queries/types';
import { User } from '@/stores/userStore';
import { mapMeToUser } from '@/utils/mapMeToUser';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'FlexRate',
  description: '라이프스타일을 통해 평가받는 신용대출, FlexRate',
};

const toUserOrNull = (me: Me | null): User | null => (me ? mapMeToUser(me) : null);

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const meRaw = await fetchMeSSR().catch(() => null);
  const initialUser = toUserOrNull(meRaw);
  return (
    <html lang="ko">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            *{box-sizing:border-box;margin:0;padding:0}
            html{font-size:14px}
            body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial}
          `,
          }}
        />
      </head>
      <body>
        <Providers initialUser={initialUser}>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
