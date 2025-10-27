export type Me = {
  username: string;
  role: 'ADMIN' | 'MEMBER' | null;
  email: string;
  recentLoanStatus: string | null;
  hasCreditScore: boolean;
  creditScore: number;
  consumeGoal: string | null;
  consumptionType: string | null;
};

export type MainSummary = {
  totalAmount: number | null;
  repaymentMonth: number | null;
  nextPaymentDate: string | null;
  startDate: string | null;
  recentRepaymentDate: string | null;
  loanRepaymentTransactionNum: number | null;
};
