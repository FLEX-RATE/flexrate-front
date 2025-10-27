import { useQuery } from '@tanstack/react-query';

import { getCustomerLoanStatus } from '@/apis/customer';

export const useLoanStatus = (enabled = true) =>
  useQuery({
    queryKey: ['loan-status'],
    queryFn: getCustomerLoanStatus,
    enabled,
    retry: 1,
  });
