'use client';

import { useEffect, useMemo, useState } from 'react';

import type { ApexOptions } from 'apexcharts';

import { ReactApexChart } from '../charts/ApexClient';

import { ChartOverlay, KCBLabel, Percentile, Score, Wrapper } from './CircularChart.style';

interface Props {
  loading?: boolean;
  score: number;
  rank: number;
}

const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));

const CircularChart = ({ loading = false, score, rank }: Props) => {
  const targetPercent = useMemo(() => clamp((score / 1000) * 100), [score]);

  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = (e: MediaQueryList | MediaQueryListEvent) => setReduced(!!e.matches);
    apply(mq);
    const handler = (e: MediaQueryListEvent) => apply(e);
    mq.addEventListener?.('change', handler);
    mq.addListener?.(handler);
    return () => {
      mq.removeEventListener?.('change', handler);
      mq.removeListener?.(handler);
    };
  }, []);

  const [series, setSeries] = useState<number[]>([0]);
  useEffect(() => {
    if (loading) {
      setSeries([0]);
    } else {
      setSeries([targetPercent]);
    }
  }, [loading, targetPercent]);

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'radialBar',
        toolbar: { show: false },
        animations: {
          enabled: !reduced,
          speed: loading ? 1800 : 600,
          animateGradually: { enabled: false },
          dynamicAnimation: { enabled: true, speed: loading ? 1800 : 600 },
        },
      },
      plotOptions: {
        radialBar: {
          hollow: { size: '84%' },
          track: { strokeWidth: '100%' },
          dataLabels: { show: false },
        },
      },
      stroke: { lineCap: 'round' },
      labels: ['KCB'],
    }),
    [loading, reduced]
  );

  return (
    <Wrapper
      animate={loading ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
      transition={
        loading ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }
      }
    >
      <ReactApexChart options={options} series={series} type="radialBar" height={280} />
      <ChartOverlay>
        <KCBLabel>KCB</KCBLabel>
        <Score>
          {!loading && (
            <>
              <Score strong>{score}</Score>점
            </>
          )}
        </Score>
        {!loading && <Percentile>{`상위 ${rank}%`}</Percentile>}
      </ChartOverlay>
    </Wrapper>
  );
};

export default CircularChart;
