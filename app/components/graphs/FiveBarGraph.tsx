import { MouseEvent, useEffect, useRef, useState } from "react";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import { BAR_DEFAULT_CONFIG } from "../../fixtures/DefaultChartConfig";
import { BarElement, CategoryScale, Chart, LinearScale } from "chart.js";
import { METRIC_COLORS } from "../../fixtures/Colors";

type FiveBarGraphProps = {
  data: number[];
};

Chart.register(LinearScale, CategoryScale, BarElement)

export default function FiveBarGraph(props: FiveBarGraphProps) {
  const [chartData, setChartData] = useState(BAR_DEFAULT_CONFIG);
  const chartRef = useRef<Chart | null>(null);

  const handleChartClick = (event: MouseEvent) => {
    if (!chartRef.current) return;

    const elements = getElementAtEvent(chartRef.current, event);
    if (!elements.length) return;

    const index = elements[0].index;

    const baseBackgrounds = [
      `rgba(${METRIC_COLORS.MIND}, 0.3)`,
      `rgba(${METRIC_COLORS.BODY}, 0.3)`,
      `rgba(${METRIC_COLORS.CASH}, 0.3)`,
      `rgba(${METRIC_COLORS.WORK}, 0.3)`,
      `rgba(${METRIC_COLORS.BOND}, 0.3)`,
    ];

    const nextBackgrounds = [...baseBackgrounds];
    if (index >= 0 && index < nextBackgrounds.length) {
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
  };

  useEffect(() => {
    setChartData({
      ...chartData,
      data: {
        labels: [
          'MIND',
          'BODY',
          'CASH',
          'WORK',
          'BOND',
        ],
        datasets: [{
          label: 'Metrics',
          data: props.data,
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
    });
  }, []);

  return (
    <Bar
      ref={chartRef}
      onClick={handleChartClick}
      data={chartData.data}
      options={chartData.options}
    />
  )
}