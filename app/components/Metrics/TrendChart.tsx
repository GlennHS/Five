"use client"

import { Line } from "react-chartjs-2"

export default function TrendChart({
  data,
  weeklyChange,
}: {
  data: number[]
  weeklyChange: number
}) {
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data,
        borderColor: "#f97316",
        backgroundColor: "rgba(249,115,22,0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
      },
    ],
  }

  const options = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { color: "#e5e7eb" },
      },
    },
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4">
      <p className="font-semibold mb-4">Trend (this week)</p>

      <Line data={chartData} options={options} />

      <div className="mt-4 flex justify-between text-sm">
        <div>
          <p className="text-gray-500">Weekly change</p>
          <p className="text-orange-500 font-semibold">+{weeklyChange}</p>
        </div>

        <div className="text-right">
          <p className="text-gray-500">Best day</p>
          <p className="font-medium">Sun (+22)</p>
        </div>
      </div>
    </div>
  )
}