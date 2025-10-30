import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import type { User } from '@/stores/userStore';

function getOrigin() {
  const h = headers();
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const host = h.get('x-forwarded-host') ?? h.get('host')!;
  return `${proto}://${host}`;
}

async function getMe(): Promise<User | null> {
  const origin = getOrigin();
  const cookieHeader = cookies().toString();

  const res = await fetch(`${origin}/api/bff/api/members/mypage`, {
    headers: { cookie: cookieHeader },
    cache: 'no-store',
  });

  if (res.status === 401) return null;
  if (!res.ok) throw new Error('Failed to load mypage user');

  const d = await res.json();
  return {
    username: d.name,
    role: d.role,
    email: d.email,
    recentLoanStatus: d.recentLoanStatus,
    hasCreditScore: d.hasCreditScore,
    creditScore: d.creditScore ?? 0,
    consumeGoal: d.consumeGoal,
    consumptionType: d.consumptionType,
  };
}

const MyPage = async () => {
  const me = await getMe();
  if (!me) redirect('/auth/login');

  const Client = (await import('./MypageClient')).default;
  return <Client initialUser={me} />;
};

export default MyPage;
