import { useEffect, useMemo, useRef } from "react";
import { Radar } from "react-chartjs-2";
import { defaultRadarConfig } from "../../constants/DefaultChartConfig";
import {
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Chart,
  ChartEvent,
  ActiveElement,
  ChartOptions,
} from 'chart.js'
import { METRIC_COLORS } from "../../constants/Colors";
import type { FiveMetric, MetricKey } from "../../types";
import ChartDataLabels from 'chartjs-plugin-datalabels'

type FiveBarGraphProps = {
  data: FiveMetric | null;
  highlightedMetric?: MetricKey | null;
  onMetricChange?: (metric: MetricKey | null) => void;
};

const METRIC_ORDER: MetricKey[] = ["mind", "body", "cash", "work", "bond"];

const METRIC_RGB = [
  METRIC_COLORS.MIND,
  METRIC_COLORS.BODY,
  METRIC_COLORS.CASH,
  METRIC_COLORS.WORK,
  METRIC_COLORS.BOND,
]

Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartDataLabels
)

export default function FiveRadar({data, highlightedMetric, onMetricChange}: FiveBarGraphProps) {
  const chartRef = useRef<Chart<'radar'> | null>(null);

  const chartData = useMemo(() => {
    const values = data
      ? [data.mind, data.body, data.cash, data.work, data.bond]
      : [30, 40, 56, 64, 88];

    const selectedIndex =
      highlightedMetric != null
        ? METRIC_ORDER.indexOf(highlightedMetric)
        : -1;

    const baseColor = selectedIndex >= 0
      ? METRIC_RGB[selectedIndex]
      : '54, 162, 235'; // fallback blue

    return {
      labels: METRIC_ORDER,
      datasets: [
        {
          label: "Metrics",
          data: values,

          // 👇 dynamic background
          backgroundColor:
            selectedIndex >= 0
              ? `rgba(${baseColor}, 0.25)`
              : 'rgba(54, 162, 235, 0.15)',

          borderColor:
            selectedIndex >= 0
              ? `rgb(${baseColor})`
              : '#36A2EB',

          borderWidth: 2,

          // 👇 keep your per-point branding
          pointBackgroundColor: METRIC_RGB.map((c, i) =>
            selectedIndex === -1 || selectedIndex === i
              ? `rgb(${c})`
              : `rgba(${c}, 0.3)`
          ),

          pointRadius: METRIC_ORDER.map((_, i) =>
            i === selectedIndex ? 6 : 4
          ),
        },
      ],
    };
  }, [data, highlightedMetric]);

  const chartOptions: ChartOptions<'radar'> = {
    ...defaultRadarConfig.options,
    onClick: (_event, elements) => {
      if (!elements.length) {
        onMetricChange?.(null);
        return;
      }

      const index = elements[0].index;
      const metric = METRIC_ORDER[index];

      if (metric) {
        onMetricChange?.(metric);
      }
    },
    plugins: {
      ...defaultRadarConfig.options?.plugins,
      datalabels: {
        color: '#000',
        font: { weight: 'bold' },
        formatter: (value: number) => value,
        align: "top" as const,
        offset: 6,
      },
    },
  };

  if (data === null) return <></>

  return (
    <div className="h-full w-full">
      <Radar
        ref={chartRef}
        data={chartData}
        options={chartOptions}
      />
    </div>
  )
}