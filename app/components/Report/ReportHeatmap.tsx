import { METRIC_KEYS } from "@/app/types"
import { METRIC_INFO } from "@/app/constants/Constants"
import { DayHeatmapCell } from "@/app/hooks/useWeeklyReport"
import { useInViewAnimation } from "../useInViewAnimation"

function getOpacity(value: number): string {
  if (value <= 0) return "opacity-10"
  if (value < 3) return "opacity-30"
  if (value < 6) return "opacity-60"
  return "opacity-100"
}

export default function ReportHeatmap({ heatmap }: { heatmap: DayHeatmapCell[] }) {
  const { ref, isVisible } = useInViewAnimation<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`bg-white border rounded-2xl p-4 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <p className="font-semibold mb-3 text-sm">Week at a glance</p>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {heatmap.map(cell => (
          <p key={cell.label} className="text-center text-xs text-neutral-400">{cell.label}</p>
        ))}
      </div>

      {/* 5 metric rows × 7 day columns */}
      <div className="flex flex-col gap-1">
        {METRIC_KEYS.map(metric => {
          const info = METRIC_INFO[metric]
          return (
            <div key={metric} className="grid grid-cols-7 gap-1 items-center">
              {heatmap.map(cell => (
                <div
                  key={cell.label}
                  className={`
                    aspect-square rounded-md
                    bg-${metric}
                    ${getOpacity(cell.metricValues[metric])}
                  `}
                  title={`${info.title} on ${cell.label}: ${cell.metricValues[metric]}`}
                />
              ))}
            </div>
          )
        })}
      </div>

      {/* Metric legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
        {METRIC_KEYS.map(metric => {
          const info = METRIC_INFO[metric]
          return (
            <div key={metric} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-sm bg-${metric}`} />
              <span className="text-xs text-neutral-500">{info.title}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}