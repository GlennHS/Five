import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { BAR_DEFAULT_CONFIG } from "../../fixtures/DefaultChartConfig";
import { BarElement, CategoryScale, Chart, LinearScale } from "chart.js";

type FiveBarGraphProps = {
  data: number[];
};

Chart.register(LinearScale, CategoryScale, BarElement)

export default function FiveBarGraph(props: FiveBarGraphProps) {
  const [chartData, setChartData] = useState(BAR_DEFAULT_CONFIG);

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
          borderColor: 'rgb(75, 192, 192)',
        }]
      },
    });
  }, []);

  return (
    <Bar
      data={chartData.data}
      options={chartData.options}
    />
  )
}