import { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import { RADAR_DEFAULT_CONFIG } from "../fixtures/DefaultChartConfig";
import { Chart, Element } from "chart.js";
import { FIVE_COLORS } from "../utils/colors";

type FiveRadarGraphProps = {
  data: number[]
}

const onClick = (event: MouseEvent, elements: any, chart: Chart) => {
  if (!elements.length) return;

  const index = elements[0].index;

  const colors = [
    FIVE_COLORS.MIND,
    FIVE_COLORS.BODY,
    FIVE_COLORS.CASH,
    FIVE_COLORS.WORK,
    FIVE_COLORS.BOND
  ];

  chart.data.datasets[0].borderColor = colors[index];
  chart.data.datasets[0].backgroundColor = colors[index] + '33';

  chart.update();
};

export default function FiveRadarGraph(props: FiveRadarGraphProps) {
  const [chartData, setChartData] = useState(RADAR_DEFAULT_CONFIG)
  const [forceReRender, setForceReRender] = useState(false)
  const [radarColor, setRadarColor] = useState(FIVE_COLORS.MIND)

  useEffect(() => {
    setForceReRender(false)
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
  }, [])

  return (
    <Radar
      // onClick={onclick}
      key={forceReRender ? "a" : "b"}
      data={chartData.data}
    />
  )
}