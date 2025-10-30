'use client';

import { useInView } from 'react-intersection-observer';

import { useInterestStats } from '@/hooks/useInterestStats';

import AreaChart from './AreaChart';

const LazyAreaChart = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px',
  });

  const { data } = useInterestStats('DAILY', { enabled: inView });

  return <div ref={ref}>{inView && data ? <AreaChart /> : null}</div>;
};

export default LazyAreaChart;
