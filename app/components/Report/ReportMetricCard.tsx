"use client"

import { MetricKey } from "@/app/types"
import { METRIC_INFO } from "@/app/constants/Constants"
import { METRIC_COLORS } from "@/app/constants/Colors"
import { MetricReport } from "@/app/hooks/useWeeklyReport"
import { Line } from "react-chartjs-2"
import { CategoryScale, Chart, Filler, LinearScale, LineElement, PointElement } from "chart.js"
import { useInViewAnimation } from "../useInViewAnimation"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler)

function MomentumBadge({ momentum, metric }: { momentum: MetricReport["momentum"], metric: MetricKey }) {
  if (momentum === "up") return (
    <span className={`flex items-center gap-1 text-xs font-medium text-${metric}`}>
      <TrendingUp size={12} /> Improving
    </span>
  )
  if (momentum === "down") return (
    <span className="flex items-center gap-1 text-xs font-medium text-neutral-400">
      <TrendingDown size={12} /> Declining
    </span>
  )
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-neutral-400">
      <Minus size={12} /> Steady
    </span>
  )
}

function getOpacity(value: number): string {
  if (value <= 0) return "opacity-10"
  if (value < 3) return "opacity-30"
  if (value < 6) return "opacity-60"
  return "opacity-100"
}

export default function ReportMetricCard({ report }: { report: MetricReport }) {
  const { metric, score, previousScore, change, momentum, trendData, topAction, heatmap } = report
  const info = METRIC_INFO[metric]
  const color = METRIC_COLORS[metric]
  const isPositive = change >= 0

  const { ref, isVisible } = useInViewAnimation<HTMLDivElement>()

  const chartData = {
    labels: heatmap.map(d => d.label),
    datasets: [{
      data: trendData,
      borderColor: `rgb(${color})`,
      backgroundColor: `rgba(${color}, 0.15)`,
      fill: true,
      pointRadius: 3,
      tension: 0.3,
    }],
  }

  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: { display: false },
    },
  }

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl border shadow-sm p-4 space-y-3 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-${metric}`}><info.icon size={18} /></span>
          <span className={`font-semibold text-${metric}`}>{info.title}</span>
        </div>
        <MomentumBadge momentum={momentum} metric={metric} />
      </div>

      {/* Score row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-50 rounded-xl py-2">
          <p className="text-xs text-gray-400">This week</p>
          <p className={`text-2xl font-bold text-${metric}`}>{score}</p>
        </div>
        <div className="bg-gray-50 rounded-xl py-2">
          <p className="text-xs text-gray-400">Last week</p>
          <p className="text-2xl font-bold text-gray-400">{previousScore}</p>
        </div>
        <div className="bg-gray-50 rounded-xl py-2">
          <p className="text-xs text-gray-400">Change</p>
          <p className={`text-2xl font-bold ${isPositive ? `text-${metric}` : "text-neutral-400"}`}>
            {isPositive ? `+${change}` : change}
          </p>
        </div>
      </div>

      {/* Per-metric heatmap row */}
      <div>
        <p className="text-xs text-neutral-400 mb-1">Daily activity</p>
        <div className="grid grid-cols-7 gap-1">
          {heatmap.map(cell => (
            <div key={cell.label} className="flex flex-col items-center gap-0.5">
              <div
                className={`w-full aspect-square rounded-md bg-${metric} ${getOpacity(cell.value)}`}
                title={`${cell.label}: ${cell.value}`}
              />
              <span className="text-[9px] text-neutral-400">{cell.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trend chart */}
      <Line data={chartData} options={chartOptions} />

      {/* Top action */}
      {topAction && (
        <p className="text-xs text-gray-500">
          Most logged: <span className="font-medium text-gray-700">{topAction.name}</span>{" "}
          <span className={`text-${metric} font-semibold`}>×{topAction.count}</span>
        </p>
      )}
    </div>
  )
}