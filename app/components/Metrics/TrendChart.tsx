"use client"

import { MetricKey } from "@/app/types"
import { Line } from "react-chartjs-2"
import { CategoryScale, Chart, Filler, LinearScale, LineElement, PointElement, Tick } from 'chart.js';
import { METRIC_COLORS } from "@/app/constants/Colors";
import { getRollingWeekLabels } from "@/app/lib/dateTime";
import { useInViewAnimation } from "../useInViewAnimation";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

export default function TrendChart({
  data,
  weeklyChange,
  metric,
}: {
  data: number[]
  weeklyChange: number
  metric: MetricKey
}) {
  const { ref, isVisible } = useInViewAnimation<HTMLDivElement>();

  const rollingWeekLabels = getRollingWeekLabels()
  const chartData = {
    labels: rollingWeekLabels,
    datasets: [
      {
        data,
        borderColor: `rgb(${METRIC_COLORS[metric]})`,
        backgroundColor: `rgba(${METRIC_COLORS[metric]}, 0.4)`,
        fill: true,
        pointRadius: 4,
      },
    ],
  }

  const options = {
    plugins: {
      legend: { display: false },
      annotations: false,
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { color: "#e5e7eb" },
        ticks: {
          callback: function(value: string | number, index: number, ticks: Tick[]) {
            return typeof(value) === 'string' ? value : Math.floor(value);
          }
        },
      },
    },
  }

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl shadow-sm border p-4 transition-all duration-700 delay-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <p className="font-semibold mb-4">Trend (this week)</p>

      <Line data={chartData} options={options} />

      <div className="mt-4 flex justify-between text-sm">
        <div>
          <p className="text-gray-500">Weekly change</p>
          <p className={`text-${metric} font-semibold`}>+{weeklyChange}</p>
        </div>

        <div className="text-right">
          <p className="text-gray-500">Best day</p>
          <p className="font-medium">{rollingWeekLabels[data.indexOf(Math.max(...data))]} ({Math.max(...data)})</p>
        </div>
      </div>
    </div>
  )
}