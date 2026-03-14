import { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { BAR_DEFAULT_CONFIG } from "../../fixtures/DefaultChartConfig";
import { ActiveElement, BarElement, CategoryScale, Chart, ChartEvent, LinearScale } from "chart.js";
import { METRIC_COLORS } from "../../fixtures/Colors";
import type { FiveMetric, MetricKey } from "../../types";

type FiveBarGraphProps = {
  data?: FiveMetric;
  highlightedMetric?: MetricKey | null;
  onMetricChange?: (metric: MetricKey | null) => void;
};

const METRIC_ORDER: MetricKey[] = ["mind", "body", "cash", "work", "bond"];

Chart.register(LinearScale, CategoryScale, BarElement)

export default function FiveBarGraph(props: FiveBarGraphProps) {
  const [chartData, setChartData] = useState(BAR_DEFAULT_CONFIG);
  const chartRef = useRef<Chart<'bar'> | null>(null);

  const handleChartClick = (event: ChartEvent, elements: ActiveElement[], chart: Chart<'bar'>) => {
    if (!chartRef?.current) return;

    if (!elements?.length) {
      changeSelectedBar(-1);
      props.onMetricChange?.(null);
      return;
    }

    const index = elements[0].index;

    changeSelectedBar(index);

    const MetricKey = METRIC_ORDER[index];
    if (MetricKey) {
      props.onMetricChange?.(MetricKey);
    }
  };

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
      const colorValues = [
        METRIC_COLORS.MIND,
        METRIC_COLORS.BODY,
        METRIC_COLORS.CASH,
        METRIC_COLORS.WORK,
        METRIC_COLORS.BOND,
      ];

      const activeColor = colorValues[index];
      nextBackgrounds[index] = `rgba(${activeColor}, 0.8)`;
    }

    chartRef.current.data.datasets[0].backgroundColor = nextBackgrounds;
    chartRef.current.update();
  }

  const convertMetricsToData = (m: FiveMetric): number[] => [m.mind, m.body, m.cash, m.work, m.bond]

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChartData((prev) => ({
      ...prev,
      data: {
        labels: METRIC_ORDER,
        datasets: [{
          label: 'Metrics',
          data: props.data ? convertMetricsToData(props.data) : [30,40,56,64,88],
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
        }]
      },
      options: {
        onClick: handleChartClick,
        onHover: handleChartClick
      }
    }));
  }, []);

  useEffect(() => {
    if (props.highlightedMetric == null) {
      changeSelectedBar(-1);
      return;
    }

    const index = METRIC_ORDER.indexOf(props.highlightedMetric);
    changeSelectedBar(index === -1 ? -1 : index);
  }, [props.highlightedMetric])

  return (
    <div className="h-full w-full">
      <Bar
        ref={chartRef}
        data={chartData.data}
        options={chartData.options}
      />
    </div>
  )
}