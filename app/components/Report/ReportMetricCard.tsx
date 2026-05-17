"use client"

import { MetricKey } from "@/app/types"
import { METRIC_INFO } from "@/app/constants/Constants"
import { METRIC_COLORS } from "@/app/constants/Colors"
import { MetricReport } from "@/app/hooks/useWeeklyReport"
import { Line } from "react-chartjs-2"
import { CategoryScale, Chart, Filler, LinearScale, LineElement, PointElement } from "chart.js"
import { useInViewAnimation } from "../useInViewAnimation"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import Heatmap from "../Heatmap"
import { HeatmapDay } from "@/app/types"
import dayjs from "dayjs"

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler)

function MomentumBadge({ momentum, metric }: { momentum: MetricReport["momentum"], metric: MetricKey }) {
  if (momentum === "up") return (
    <span className={`flex items-center gap-1 text-xs font-medium text-${metric}`}>
      <TrendingUp size={12} /> Improving
    </span>
  )
  if (momentum === "down") return (
    <span className="flex items-center gap-1 text-xs font-medium text-neutral-400 dark:text-zinc-500">
      <TrendingDown size={12} /> Declining
    </span>
  )
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-neutral-400 dark:text-zinc-500">
      <Minus size={12} /> Steady
    </span>
  )
}

export default function ReportMetricCard({ report, weekStart }: { report: MetricReport, weekStart: dayjs.Dayjs }) {
  const { metric, score, previousScore, change, momentum, trendData, topAction, heatmap } = report
  const info = METRIC_INFO[metric]
  const color = METRIC_COLORS[metric]
  const isPositive = change >= 0

  const { ref, isVisible } = useInViewAnimation<HTMLDivElement>()

  // Derive HeatmapDay[] from the metric heatmap + the week start date
  const heatmapDays: HeatmapDay[] = heatmap.map((cell, i) => ({
    day: weekStart.add(i, 'day'),
    value: cell.value,
  }))

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
      className={`bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm p-4 space-y-3 transition-all duration-700 ${
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
        <div className="bg-gray-50 dark:bg-zinc-700 rounded-xl py-2">
          <p className="text-xs text-gray-400 dark:text-zinc-400">This week</p>
          <p className={`text-2xl font-bold text-${metric}`}>{score}</p>
        </div>
        <div className="bg-gray-50 dark:bg-zinc-700 rounded-xl py-2">
          <p className="text-xs text-gray-400 dark:text-zinc-400">Last week</p>
          <p className="text-2xl font-bold text-gray-400 dark:text-zinc-400">{previousScore}</p>
        </div>
        <div className="bg-gray-50 dark:bg-zinc-700 rounded-xl py-2">
          <p className="text-xs text-gray-400 dark:text-zinc-400">Change</p>
          <p className={`text-2xl font-bold ${isPositive ? `text-${metric}` : "text-neutral-400 dark:text-zinc-500"}`}>
            {isPositive ? `+${change}` : change}
          </p>
        </div>
      </div>

      {/* Heatmap */}
      <div>
        <p className="text-xs text-neutral-400 dark:text-zinc-500 mb-1">Daily activity</p>
        <Heatmap days={heatmapDays} metric={metric} />
      </div>

      {/* Trend chart */}
      <Line data={chartData} options={chartOptions} />

      {/* Top action */}
      {topAction && (
        <p className="text-xs text-gray-500 dark:text-zinc-400">
          Most logged:{" "}
          <span className="font-medium text-gray-700 dark:text-zinc-200">{topAction.name}</span>{" "}
          <span className={`text-${metric} font-semibold`}>×{topAction.count}</span>
        </p>
      )}
    </div>
  )
}
