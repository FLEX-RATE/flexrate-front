export const formatKoreanMoneyUnit = (amount: number): string => {
  if (amount >= 10_000_000) {
    return `${Math.floor(amount / 1_000_000)}백만원`;
  }
  if (amount >= 100_000) {
    return `${Math.floor(amount / 10_000)}만원`;
  }
  if (amount >= 10_000) {
    return `${Math.floor(amount / 1_000)}천원`;
  }
  return `${amount.toLocaleString()}원`;
};
