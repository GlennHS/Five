import { TrendingUp, TrendingDown, Minus, CalendarDays, Zap } from "lucide-react"
import { WeeklyReport } from "@/app/hooks/useWeeklyReport"

export default function ReportOverviewCards({ report }: { report: WeeklyReport }) {
  const actionDiff = report.totalActionsThisWeek - report.totalActionsLastWeek
  const actionDiffLabel = actionDiff === 0 ? "same as last week"
    : actionDiff > 0 ? `+${actionDiff} vs last week`
    : `${actionDiff} vs last week`

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Total actions */}
      <div className="bg-white border rounded-2xl p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-neutral-500">
          <Zap size={14} />
          <span className="text-xs">Actions logged</span>
        </div>
        <p className="text-3xl font-bold text-neutral-700">{report.totalActionsThisWeek}</p>
        <p className={`text-xs ${actionDiff >= 0 ? "text-neutral-500" : "text-neutral-400"}`}>
          {actionDiffLabel}
        </p>
      </div>

      {/* Best day */}
      <div className="bg-white border rounded-2xl p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-neutral-500">
          <CalendarDays size={14} />
          <span className="text-xs">Best day</span>
        </div>
        <p className="text-3xl font-bold text-neutral-700">{report.bestDay.label}</p>
        <p className="text-xs text-neutral-400">score {report.bestDay.score}</p>
      </div>
    </div>
  )
}