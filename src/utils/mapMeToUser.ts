import type { Me } from '@/queries/types';
import type { User, ConsumptionType } from '@/stores/userStore';
import type { LoanStatusType } from '@/types/user.type';

const normalizeRole = (role: Me['role']): User['role'] => (role === 'ADMIN' ? 'ADMIN' : 'MEMBER');

const CONSUMPTION_TYPES = new Set<ConsumptionType>([
  'CONSERVATIVE',
  'BALANCED',
  'PRACTICAL',
  'CONSUMPTION_ORIENTED',
]);
const normalizeConsumption = (v: string | null | undefined): ConsumptionType | undefined =>
  v && CONSUMPTION_TYPES.has(v as ConsumptionType) ? (v as ConsumptionType) : undefined;

const LOAN_STATUSES = new Set<LoanStatusType>([
  'EXECUTED',
  'NONE',
  'PRE_APPLIED',
  'PENDING',
  'REJECTED',
] as unknown as LoanStatusType[]);
const normalizeLoanStatus = (v: string | null): LoanStatusType | null =>
  v && LOAN_STATUSES.has(v as LoanStatusType) ? (v as LoanStatusType) : null;

export const mapMeToUser = (me: Me): User => ({
  username: me.username ?? '',
  role: normalizeRole(me.role),
  email: me.email ?? '',
  recentLoanStatus: normalizeLoanStatus(me.recentLoanStatus),
  hasCreditScore: !!me.hasCreditScore,
  creditScore: Number.isFinite(me.creditScore) ? me.creditScore : 0,
  consumeGoal: me.consumeGoal ?? undefined,
  consumptionType: normalizeConsumption(me.consumptionType),
});
