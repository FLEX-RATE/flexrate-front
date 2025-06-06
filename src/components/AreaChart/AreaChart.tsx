import { useMemo, useState } from 'react';

import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

import { useInterestStats } from '@/hooks/useInterestStats';
import { semanticColor } from '@/styles/colors';
import { typoStyleMap } from '@/styles/typos';
import { PERIOD_TYPES, PeriodKey } from '@/types/chart.type';
import { formatPeriodLabel } from '@/utils/formatPeriodLabel';

import {
  ChartBtnContainer,
  ChartContainer,
  ChartHeader,
  ChartTitle,
  PeriodBtn,
} from './AreaChart.style';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const cleanCSS = (css: string) => css.replace(/\s+/g, ' ').trim();

const AreaChart = () => {
  const [periodType, setPeriodType] = useState<PeriodKey>('DAILY');
  const { data } = useInterestStats(periodType);

  const series: ApexAxisChartSeries = [
    {
      name: '금리',
      data:
        data?.rates.map((item) => ({
          x: formatPeriodLabel(item.period, periodType),
          y: item.averageRate,
        })) ?? [],
    },
  ];

  const categories = useMemo(() => {
    return data?.rates.map((d) => formatPeriodLabel(d.period, periodType)) ?? [];
  }, [data, periodType]);

  console.log(data?.rates.length);

  const getCompareText = (type: PeriodKey): string => {
    switch (type) {
      case 'DAILY':
        return '어제 대비';
      case 'WEEKLY':
        return '지난 주 대비';
      case 'MONTHLY':
        return '지난 달 대비';
      default:
        return '';
    }
  };

  const chartOptions: ApexOptions = useMemo(() => {
    const isSingleData = data?.rates.length === 1;

    return {
      chart: {
        id: 'interest-chart',
        type: 'area',
        background: semanticColor.bg.default,
        zoom: {
          enabled: true,
          type: 'x',
          autoScaleYaxis: true,
        },
        toolbar: { show: false },
        events: {
          zoomed: (_chartContext, { xaxis }) => {
            if (xaxis?.max == null || xaxis?.min == null) return;

            const rangeDays = (xaxis.max - xaxis.min) / (1000 * 60 * 60 * 24);
            const maxRange = PERIOD_TYPES[periodType].maxRangeInDays;

            if (rangeDays > maxRange) {
              ApexCharts.exec('interest-chart', 'resetZoom');
              alert(`${PERIOD_TYPES[periodType].label} 범위까지만 확대할 수 있어요`);
            } else {
              if (rangeDays <= 7) setPeriodType('DAILY');
              else if (rangeDays <= 28) setPeriodType('WEEKLY');
              else setPeriodType('MONTHLY');
            }
          },
        },
      },

      markers: {
        size: isSingleData ? 5 : 0,
        colors: [semanticColor.bg.primary],
        strokeColors: '#fff',
        strokeWidth: 2,
        shape: 'circle',
        ...(isSingleData
          ? {
              discrete: [
                {
                  seriesIndex: 0,
                  dataPointIndex: 0,
                  fillColor: semanticColor.bg.primary,
                  strokeColor: '#fff',
                  size: 6,
                },
              ],
            }
          : {}),
      },

      stroke: {
        curve: 'smooth',
        width: 2,
        colors: [semanticColor.bg.primary],
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 1,
          opacityTo: 0,
          stops: [0, 100],
        },
      },
      grid: { show: false },
      dataLabels: { enabled: false },
      yaxis: { labels: { show: false } },
      xaxis: {
        type: 'category',
        categories,
        crosshairs: { show: false },
        labels: {
          rotate: -45,
          style: { fontSize: '10px' },
        },
        tickAmount: 6,
        tooltip: { enabled: false },
      },
      tooltip: {
        followCursor: true,
        enabled: true,
        custom: (params) => {
          const { series, seriesIndex, dataPointIndex } = params;
          const value = series[seriesIndex][dataPointIndex];
          const periodLabel = formatPeriodLabel(
            data?.rates[dataPointIndex]?.period ?? '',
            periodType
          );

          const compareText = getCompareText(periodType);
          const changePercent = data?.rates[dataPointIndex]?.changeRatePercent ?? 0;
          const formattedPercent = changePercent.toFixed(1);
          const formattedValue = value.toFixed(1);

          return `
        <div style="padding: 10px; border-radius: 15px; background: ${
          semanticColor.card.card1
        }; width: 137px;">
          <div style="${cleanCSS(typoStyleMap['title2'])}; color: ${
            semanticColor.text.normal.primary
          };">
            ${formattedValue}<span style="${cleanCSS(typoStyleMap['caption3_b'])}; color: ${
            semanticColor.text.normal.primary
          };">%</span>
          </div>
          <div style="font-size: 12px; color: #9CA3AF; margin-top: 4px;">${periodLabel}</div>
          <div style="font-size: 13px; margin-top: 4px; color: #4B5563;">
            ${compareText} <span style="color: #10B981; font-weight: 600; margin-left: 4px;">▲ ${formattedPercent}%</span>
          </div>
        </div>
      `;
        },
      },
    };
  }, [categories, periodType, data]);

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>나의 대출 금리 변화</ChartTitle>
        <ChartBtnContainer>
          {Object.entries(PERIOD_TYPES).map(([key, { label }]) => (
            <PeriodBtn
              key={key}
              btnKey={key as PeriodKey}
              onClick={() => {
                setPeriodType(key as PeriodKey);
              }}
              periodType={periodType}
            >
              {label}
            </PeriodBtn>
          ))}
        </ChartBtnContainer>
      </ChartHeader>
      <ApexChart key={periodType} options={chartOptions} series={series} type="area" height={180} />
    </ChartContainer>
  );
};

export default AreaChart;
