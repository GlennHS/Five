import { MouseEvent, useEffect, useRef, useState } from "react";
import { Radar, getElementAtEvent } from "react-chartjs-2";
import { RADAR_DEFAULT_CONFIG } from "../../fixtures/DefaultChartConfig";
import { Chart } from "chart.js";
import { FIVE_COLORS } from "../../utils/colors";

type FiveRadarGraphProps = {
  data: number[];
};

export default function FiveRadarGraph(props: FiveRadarGraphProps) {
  const [chartData, setChartData] = useState(RADAR_DEFAULT_CONFIG);
  const [radarColor, setRadarColor] = useState(FIVE_COLORS.MIND);
  const chartRef = useRef<Chart | null>(null);

  const handleChartClick = (event: MouseEvent) => {
    if (!chartRef.current) return;

    const elements = getElementAtEvent(chartRef.current, event);
    if (!elements.length) return;

    const index = elements[0].index;

    const colors = [
      FIVE_COLORS.MIND,
      FIVE_COLORS.BODY,
      FIVE_COLORS.CASH,
      FIVE_COLORS.WORK,
      FIVE_COLORS.BOND,
    ];

    const nextColor = colors[index] ?? FIVE_COLORS.MIND;
    setRadarColor(nextColor);

    chartRef.current.data.datasets[0].borderColor = nextColor;
    chartRef.current.data.datasets[0].backgroundColor = `${nextColor}33`;
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
        datasets:[{
          label: 'Metrics',
          data: props.data,
          fill: true,
          backgroundColor: `${radarColor}66`,
          borderColor: radarColor,
          pointBackgroundColor: radarColor,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: radarColor
        }]
      }
    });
  }, []);

  return (
    <Radar
      ref={chartRef}
      onClick={handleChartClick}
      data={chartData.data}
      options={chartData.options}
    />
  )
}