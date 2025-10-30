'use client';

import dynamic from 'next/dynamic';

export const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: 200 }} />,
});
