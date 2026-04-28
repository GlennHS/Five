import { useEffect, useMemo, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { defaultBarConfig } from "../../constants/DefaultChartConfig";
import { ActiveElement, BarElement, CategoryScale, Chart, ChartEvent, LinearScale } from "chart.js";
import { METRIC_COLORS } from "../../constants/Colors";
import type { FiveMetric, MetricKey } from "../../types";
import Annotation from "chartjs-plugin-annotation";
import { Settings } from "@/app/lib/settings";

type FiveBarGraphProps = {
  data: FiveMetric | null;
  highlightedMetric?: MetricKey | null;
  onMetricChange?: (metric: MetricKey | null) => void;
};

const METRIC_ORDER: MetricKey[] = ["mind", "body", "cash", "work", "bond"];

const METRIC_RGB = [
  METRIC_COLORS.mind,
  METRIC_COLORS.body,
  METRIC_COLORS.cash,
  METRIC_COLORS.work,
  METRIC_COLORS.bond,
]

Chart.register(LinearScale, CategoryScale, BarElement, Annotation)

export default function FiveBar({data, highlightedMetric, onMetricChange}: FiveBarGraphProps) {
  const chartRef = useRef<Chart<'bar'> | null>(null);
  const goal = parseInt(Settings.get('goal'))

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
            `rgba(${METRIC_COLORS.mind}, 0.3)`,
            `rgba(${METRIC_COLORS.body}, 0.3)`,
            `rgba(${METRIC_COLORS.cash}, 0.3)`,
            `rgba(${METRIC_COLORS.work}, 0.3)`,
            `rgba(${METRIC_COLORS.bond}, 0.3)`,
          ],
          borderColor: [
            `rgb(${METRIC_COLORS.mind})`,
            `rgb(${METRIC_COLORS.body})`,
            `rgb(${METRIC_COLORS.cash})`,
            `rgb(${METRIC_COLORS.work})`,
            `rgb(${METRIC_COLORS.bond})`,
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
    ...defaultBarConfig.options,
    plugins: {
      annotation: {
        annotations: {
          line1: {
            type: 'line' as const,
            yMin: goal,
            yMax: goal,
            borderColor: '#444',
            borderWidth: 1,
            borderDash: [6,6]
          }
        }
      },
      legend: {
        display: false
      }
    },
    onClick: handleChartClick,
    onHover: handleChartClick
  }), [])

  const changeSelectedBar = (index: number | null) => {
    if (!chartRef?.current) return;

    const baseBackgrounds = [
      `rgba(${METRIC_COLORS.mind}, 0.3)`,
      `rgba(${METRIC_COLORS.body}, 0.3)`,
      `rgba(${METRIC_COLORS.cash}, 0.3)`,
      `rgba(${METRIC_COLORS.work}, 0.3)`,
      `rgba(${METRIC_COLORS.bond}, 0.3)`,
    ];

    const nextBackgrounds = [...baseBackgrounds];
    if (index !== null && index >= 0 && index < nextBackgrounds.length) {
      const activeColor = METRIC_RGB[index];
      nextBackgrounds[index] = `rgba(${activeColor}, 0.8)`;
    }

    chartRef.current.data.datasets[0].backgroundColor = nextBackgrounds;
    chartRef.current.update();
  }

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