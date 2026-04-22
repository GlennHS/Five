'use client'

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { defaultLineConfig } from "../../constants/DefaultChartConfig";
import { CategoryScale, Chart, LinearScale, LineElement, PointElement } from "chart.js";

type FiveLineGraphProps = {
  data: number[];
};

Chart.register(LinearScale, CategoryScale, LineElement, PointElement);

export default function FiveLine(props: FiveLineGraphProps) {
  const [chartData, setChartData] = useState(defaultLineConfig);

  useEffect(() => {
    // Disabling as it's a run-once onload useEffect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChartData({
      ...chartData,
      data: {
        labels: [
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat',
          'Sun',
        ],
        datasets: [{
          label: 'Metrics',
          data: props.data,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
        }]
      },
    });
  }, []);

  return (
    <Line
      data={chartData.data}
      options={chartData.options}
    />
  )
}