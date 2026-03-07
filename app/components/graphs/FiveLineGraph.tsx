import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { LINE_DEFAULT_CONFIG } from "../../fixtures/DefaultChartConfig";
import { CategoryScale, Chart, LinearScale } from "chart.js";

type FiveLineGraphProps = {
  data: number[];
};

Chart.register(LinearScale, CategoryScale)

export default function FiveLineGraph(props: FiveLineGraphProps) {
  const [chartData, setChartData] = useState(LINE_DEFAULT_CONFIG);

  useEffect(() => {
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