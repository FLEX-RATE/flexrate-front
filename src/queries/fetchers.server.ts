import { cookies } from 'next/headers';

import { fetchBFF } from '@/lib/fetch-bff';
import { decodeJwtPayload, extractRoleFromClaims } from '@/lib/jwt';
import type {
  InterestRateResponse,
  InterestCurrentResponse,
  MainResponse,
} from '@/types/interest.type';

/** 내 정보 (SSR) */
export async function fetchMeSSR() {
  const ckBag = cookies();
  const token = ckBag.get('access_token')?.value ?? ckBag.get('accessToken')?.value ?? null;
  const claims = token ? decodeJwtPayload(token) : null;
  const roleFromJwt = extractRoleFromClaims(claims);

  const [memberRes, loanRes, creditRes] = await Promise.allSettled([
    fetchBFF('/api/members/mypage'),
    fetchBFF('/api/members/loan-status'),
    fetchBFF('/api/members/credit-score-status'),
  ]);

  const ok = (r: PromiseSettledResult<Response>): r is PromiseFulfilledResult<Response> =>
    r.status === 'fulfilled' && r.value.ok;

  const member = ok(memberRes) ? await memberRes.value.json() : null;
  const loanStatus = ok(loanRes) ? await loanRes.value.text() : null;
  const creditStatus = ok(creditRes) ? await creditRes.value.json() : null;

  let creditScore = 0;
  if (creditStatus?.creditScoreStatus) {
    const s = await fetchBFF('/api/credit-score').catch(() => null);
    if (s?.ok) creditScore = (await s.json())?.creditScore ?? 0;
  }

  if (!member && !roleFromJwt) return null;

  return {
    username: member?.username ?? member?.name ?? '',
    role: (roleFromJwt ?? member?.role ?? null) as 'ADMIN' | 'MEMBER' | null,
    email: member?.email ?? '',
    recentLoanStatus: loanStatus ?? null,
    hasCreditScore: !!creditStatus?.creditScoreStatus,
    creditScore,
    consumeGoal: (member?.consumeGoal ?? null) as string | null,
    consumptionType: (member?.consumptionType ?? null) as string | null,
  };
}

/** 금리: 현재 */
export async function fetchInterestCurrentSSR(): Promise<InterestCurrentResponse | null> {
  const r = await fetchBFF('/loans/interest/current');
  if (!r.ok) return null;
  return r.json();
}

/** 메인 요약 */
export async function fetchMainSummarySSR(): Promise<MainResponse | null> {
  const r = await fetchBFF('/api/members/main');
  if (!r.ok) return null;
  return r.json();
}

/** 금리 통계 */
export async function fetchInterestStatsSSR(
  periodType: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'DAILY'
): Promise<InterestRateResponse | null> {
  const r = await fetchBFF(`/loans/interest/stats?periodType=${periodType}`);
  if (!r.ok) return null;
  return r.json();
}
