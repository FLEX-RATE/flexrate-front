import { useEffect, useState } from 'react';

export const useDelayedLoading = (loading: boolean, delay = 2000) => {
  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => {
        setDelayedLoading(false);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [loading, delay]);

  return loading || delayedLoading;
};
