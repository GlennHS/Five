import { useEffect, useMemo, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { BAR_DEFAULT_CONFIG } from "../../fixtures/DefaultChartConfig";
import { ActiveElement, BarElement, CategoryScale, Chart, ChartEvent, LinearScale } from "chart.js";
import { METRIC_COLORS } from "../../fixtures/Colors";
import type { FiveMetric, MetricKey } from "../../types";

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

Chart.register(LinearScale, CategoryScale, BarElement)

export default function FiveBarGraph({data, highlightedMetric, onMetricChange}: FiveBarGraphProps) {
  const chartRef = useRef<Chart<'bar'> | null>(null);

  const chartData = useMemo(() => {
    return {
      labels: METRIC_ORDER,
      datasets: [
        {
          label: "Metrics",
          data: data
            ? [data.mind, data.body, data.cash, data.work, data.bond]
            : [30, 40, 56, 64, 88],
          backgroundColor: [
            `rgba(${METRIC_COLORS.MIND}, 0.3)`,
            `rgba(${METRIC_COLORS.BODY}, 0.3)`,
            `rgba(${METRIC_COLORS.CASH}, 0.3)`,
            `rgba(${METRIC_COLORS.WORK}, 0.3)`,
            `rgba(${METRIC_COLORS.BOND}, 0.3)`,
          ],
          borderColor: [
            `rgb(${METRIC_COLORS.MIND})`,
            `rgb(${METRIC_COLORS.BODY})`,
            `rgb(${METRIC_COLORS.CASH})`,
            `rgb(${METRIC_COLORS.WORK})`,
            `rgb(${METRIC_COLORS.BOND})`,
          ],
        },
      ],
    }
  }, [data])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChartClick = (event: ChartEvent, elements: ActiveElement[], chart: Chart<'bar'>) => {
    if (!chartRef?.current) return;

    if (!elements?.length) {
      changeSelectedBar(-1);
      onMetricChange?.(null);
      return;
    }

    const index = elements[0].index;

    changeSelectedBar(index);

    const MetricKey = METRIC_ORDER[index];
    if (MetricKey) {
      onMetricChange?.(MetricKey);
    }
  };

  const chartOptions = useMemo(() => ({
    ...BAR_DEFAULT_CONFIG.options,
    onClick: handleChartClick,
    onHover: handleChartClick
  }), [])

  const changeSelectedBar = (index: number | null) => {
    if (!chartRef?.current) return;

    const baseBackgrounds = [
      `rgba(${METRIC_COLORS.MIND}, 0.3)`,
      `rgba(${METRIC_COLORS.BODY}, 0.3)`,
      `rgba(${METRIC_COLORS.CASH}, 0.3)`,
      `rgba(${METRIC_COLORS.WORK}, 0.3)`,
      `rgba(${METRIC_COLORS.BOND}, 0.3)`,
    ];

    const nextBackgrounds = [...baseBackgrounds];
    if (index !== null && index >= 0 && index < nextBackgrounds.length) {
      const activeColor = METRIC_RGB[index];
      nextBackgrounds[index] = `rgba(${activeColor}, 0.8)`;
    }

    chartRef.current.data.datasets[0].backgroundColor = nextBackgrounds;
    chartRef.current.update();
  }

  const convertMetricsToData = (m: FiveMetric): number[] => [m.mind, m.body, m.cash, m.work, m.bond]

  useEffect(() => {
    if (highlightedMetric == null) {
      changeSelectedBar(-1);
      return;
    }

    const index = METRIC_ORDER.indexOf(highlightedMetric);
    changeSelectedBar(index === -1 ? -1 : index);
  }, [highlightedMetric])

  if (data === null) return <></>

  return (
    <div className="h-full w-full">
      <Bar
        ref={chartRef}
        data={chartData}
        options={chartOptions}
      />
    </div>
  )
}