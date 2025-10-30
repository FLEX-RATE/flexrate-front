import { fetchBFFClient, fetchBFFJsonClient } from '@/lib/fetch-bff-client';
import type {
  InterestCurrentResponse,
  InterestRateResponse,
  MainResponse,
} from '@/types/interest.type';

import type { Me } from './types';

export async function fetchMe(): Promise<Me | null> {
  const [memberRes, loanRes, creditRes] = await Promise.all([
    fetchBFFClient('/api/members/mypage'),
    fetchBFFClient('/api/members/loan-status'),
    fetchBFFClient('/api/members/credit-score-status'),
  ]);

  if (!memberRes.ok) return null;

  const member = await memberRes.json();
  const loanStatus = loanRes.ok ? await loanRes.text() : null;
  const creditStatus = creditRes.ok ? await creditRes.json() : null;

  let creditScore = 0;
  if (creditStatus?.creditScoreStatus) {
    const s = await fetchBFFClient('/api/credit-score');
    if (s.ok) creditScore = (await s.json())?.creditScore ?? 0;
  }

  return {
    username: member.username ?? member.name ?? '',
    role: member.role,
    email: member.email ?? '',
    recentLoanStatus: loanStatus as Me['recentLoanStatus'],
    hasCreditScore: !!creditStatus?.creditScoreStatus,
    creditScore,
    consumeGoal: member.consumeGoal ?? null,
    consumptionType: member.consumptionType ?? null,
  };
}

export async function fetchMainSummary(): Promise<MainResponse | null> {
  return fetchBFFJsonClient<MainResponse>('/api/members/main');
}

export async function fetchInterestCurrent(): Promise<InterestCurrentResponse | null> {
  return fetchBFFJsonClient<InterestCurrentResponse>('/loans/interest/current');
}

export async function fetchInterestStats(
  periodType: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'DAILY'
): Promise<InterestRateResponse | null> {
  return fetchBFFJsonClient<InterestRateResponse>(`/loans/interest/stats?periodType=${periodType}`);
}
