import { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { BAR_DEFAULT_CONFIG } from "../../fixtures/DefaultChartConfig";
import { ActiveElement, BarElement, CategoryScale, Chart, ChartEvent, LinearScale } from "chart.js";
import { METRIC_COLORS } from "../../fixtures/Colors";
import APP_DATA from "@/app/fixtures/AppData";
import type { MetricName } from "../../types";

type FiveBarGraphProps = {
  data?: number[];
  highlightedMetric?: MetricName | null;
  onMetricChange?: (metric: MetricName | null) => void;
};

const METRIC_ORDER: MetricName[] = ["MIND", "BODY", "CASH", "WORK", "BOND"];

Chart.register(LinearScale, CategoryScale, BarElement)

export default function FiveBarGraph(props: FiveBarGraphProps) {
  const [chartData, setChartData] = useState(BAR_DEFAULT_CONFIG);
  const chartRef = useRef<Chart | null>(null);

  const handleChartClick = (event: ChartEvent, elements: ActiveElement[], chart: Chart<'bar'>) => {
    if (!chartRef?.current) return;

    if (!elements?.length) {
      changeSelectedBar(-1);
      props.onMetricChange?.(null);
      return;
    }

    const index = elements[0].index;

    changeSelectedBar(index);

    const metricName = METRIC_ORDER[index];
    if (metricName) {
      props.onMetricChange?.(metricName);
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

  useEffect(() => {
    setChartData({
      ...chartData,
      data: {
        labels: METRIC_ORDER,
        datasets: [{
          label: 'Metrics',
          data: props.data || Object.values(APP_DATA.metrics).map(v => v.value) || [0,0,0,0,0],
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
    });
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
        onClick={handleChartClick}
        data={chartData.data}
        options={chartData.options}
      />
    </div>
  )
}