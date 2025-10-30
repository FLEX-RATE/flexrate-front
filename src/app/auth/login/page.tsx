import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import LoginPageClient from './_client.tsx/LoginPageClient';

const LoginPageServer = async () => {
  const accessToken = cookies().get('access_token')?.value;

  if (accessToken) {
    redirect('/');
  }

  return <LoginPageClient />;
};

export default LoginPageServer;
