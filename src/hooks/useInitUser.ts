import { useEffect } from 'react';

import { getMyPageUser } from '@/apis/auth';
import { useUserStore } from '@/stores/userStore';

/**
 * 사용자 정보를 초기화
 */
export const useInitUser = () => {
  const setUser = useUserStore((state) => state.setUser);
  const accessToken = useUserStore.getState().accessToken;
  const prevUser = useUserStore.getState().user;

  useEffect(() => {
    if (!accessToken) return;

    if (prevUser?.consumeGoal && prevUser?.consumptionType) return;

    getMyPageUser()
      .then((data) => {
        if (prevUser) {
          setUser({
            ...prevUser,
            consumeGoal: data.consumeGoal,
            consumptionType: data.consumptionType,
          });
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, [accessToken, prevUser, setUser]);
};
