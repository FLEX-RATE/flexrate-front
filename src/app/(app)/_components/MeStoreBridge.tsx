'use client';
import { useEffect, useRef } from 'react';

import { useMe } from '@/hooks/useMe';
import { useUserStore, type User } from '@/stores/userStore';
import { mapMeToUser } from '@/utils/mapMeToUser';

function shallowEqualUser(a: User | null, b: User | null) {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.username === b.username &&
    a.role === b.role &&
    a.email === b.email &&
    a.recentLoanStatus === b.recentLoanStatus &&
    a.hasCreditScore === b.hasCreditScore &&
    a.creditScore === b.creditScore &&
    a.consumeGoal === b.consumeGoal &&
    a.consumptionType === b.consumptionType
  );
}

const MeStoreBridge = () => {
  const { data } = useMe();
  const setUser = useUserStore((s) => s.setUser);
  const prev = useRef<User | null>(null);

  useEffect(() => {
    if (data === undefined) return;
    const next = data ? mapMeToUser(data) : null;

    if (!shallowEqualUser(prev.current, next)) {
      setUser(next);
      prev.current = next;
    }
  }, [data, setUser]);
  return null;
};

export default MeStoreBridge;
