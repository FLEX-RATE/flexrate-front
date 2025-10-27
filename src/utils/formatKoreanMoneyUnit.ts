export const formatKoreanMoneyUnit = (amount: number): string => {
  if (amount >= 100_000_000) {
    const eok = Math.floor(amount / 100_000_000);
    const man = Math.floor((amount % 100_000_000) / 10_000);
    return man ? `${eok}억 ${man}만원` : `${eok}억`;
  }
  if (amount >= 10_000) {
    const man = Math.floor(amount / 10_000);
    const cheon = Math.floor((amount % 10_000) / 1_000);
    return cheon ? `${man}만 ${cheon}천원` : `${man}만원`;
  }
  return `${amount.toLocaleString()}원`;
};
