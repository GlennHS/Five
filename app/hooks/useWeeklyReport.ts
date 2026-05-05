import { useMemo } from "react"
import { Action, ActionDefinition, METRIC_KEYS, MetricKey } from "@/app/types"
import { getDailyMetric } from "@/app/lib/metrics/getDailyMetric"
import { applyBonusToMetric } from "@/app/lib/metrics/applyBonusToMetric"
import definitionAffectsMetric from "@/app/lib/actionDefinitions/definitionAffectsMetric"
import dayjs from "dayjs"

export type DayHeatmapCell = {
  date: dayjs.Dayjs
  label: string // "Mon", "Tue" etc
  metricValues: Record<MetricKey, number> // raw daily value per metric
  totalScore: number
}

export type MetricReport = {
  metric: MetricKey
  score: number
  previousScore: number
  change: number
  momentum: "up" | "down" | "flat"
  trendData: number[]
  topAction: { name: string; count: number } | null
  heatmap: { label: string; value: number }[] // per-metric daily values
}

export type WeeklyReport = {
  thisWeek: { start: dayjs.Dayjs; end: dayjs.Dayjs }
  metrics: MetricReport[]
  focusedMetric: MetricKey
  neglectedMetric: MetricKey
  bestDay: { label: string; score: number }
  totalActionsThisWeek: number
  totalActionsLastWeek: number
  heatmap: DayHeatmapCell[] // 7 cells, one per day
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function getWeekBounds(weeksAgo: number = 0) {
  const now = dayjs()
  const daysSinceMonday = (now.day() === 0 ? 7 : now.day()) - 1
  // +7 ensures we always start from the last *completed* Mon–Sun week
  const lastMonday = now.subtract(daysSinceMonday + 7 + weeksAgo * 7, 'day').startOf('day')

  return {
    start: lastMonday,
    end: lastMonday.add(6, 'day').endOf('day'),
  }
}

function getActionsInRange(actions: Action[], start: dayjs.Dayjs, end: dayjs.Dayjs) {
  return actions.filter(a => {
    const d = dayjs(a.timestamp)
    return d.isAfter(start) && d.isBefore(end)
  })
}

function getTopActionForMetric(
  actions: Action[],
  defs: ActionDefinition[],
  metric: MetricKey
): { name: string; count: number } | null {
  const relevantDefIds = defs
    .filter(d => definitionAffectsMetric(d, metric))
    .map(d => d.id)

  const counts = new Map<number, number>()
  actions
    .filter(a => relevantDefIds.includes(a.actionId))
    .forEach(a => counts.set(a.actionId, (counts.get(a.actionId) ?? 0) + 1))

  const top = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]
  if (!top) return null
  const def = defs.find(d => d.id === top[0])
  if (!def) return null
  return { name: def.name, count: top[1] }
}

export function useWeeklyReport(actions: Action[], defs: ActionDefinition[]): WeeklyReport {
  return useMemo(() => {
    const thisWeek = getWeekBounds(0)
    const lastWeek = getWeekBounds(1)

    const thisWeekActions = getActionsInRange(actions, thisWeek.start, thisWeek.end)
    const lastWeekActions = getActionsInRange(actions, lastWeek.start, lastWeek.end)

    // --- Heatmap (all metrics, all 7 days) ---
    const heatmap: DayHeatmapCell[] = Array.from({ length: 7 }, (_, i) => {
      const date = thisWeek.start.add(i, 'day')
      const metricValues = {} as Record<MetricKey, number>
      let totalScore = 0

      METRIC_KEYS.forEach(metric => {
        const val = getDailyMetric(thisWeekActions, defs, metric, date).value
        metricValues[metric] = val
        totalScore += val
      })

      return { date, label: DAY_LABELS[i], metricValues, totalScore }
    })

    // --- Best day ---
    const bestDayCell = [...heatmap].sort((a, b) => b.totalScore - a.totalScore)[0]
    const bestDay = { label: bestDayCell.label, score: bestDayCell.totalScore }

    // --- Per-metric reports ---
    const metrics: MetricReport[] = METRIC_KEYS.map(metric => {
      const dailyValues = heatmap.map(cell => cell.metricValues[metric])

      const trendData: number[] = []
      let running = 0
      dailyValues.forEach(v => {
        running += v
        trendData.push(applyBonusToMetric(running))
      })

      const score = applyBonusToMetric(dailyValues.reduce((a, b) => a + b, 0))

      const prevDailyValues = Array.from({ length: 7 }, (_, i) => {
        const day = lastWeek.start.add(i, 'day')
        return getDailyMetric(lastWeekActions, defs, metric, day).value
      })
      const previousScore = applyBonusToMetric(prevDailyValues.reduce((a, b) => a + b, 0))
      const change = score - previousScore
      const momentum: "up" | "down" | "flat" =
        change > 5 ? "up" : change < -5 ? "down" : "flat"

      return {
        metric,
        score,
        previousScore,
        change,
        momentum,
        trendData,
        topAction: getTopActionForMetric(thisWeekActions, defs, metric),
        heatmap: heatmap.map(cell => ({
          label: cell.label,
          value: cell.metricValues[metric],
        })),
      }
    })

    const sorted = [...metrics].sort((a, b) => b.change - a.change)

    return {
      thisWeek,
      metrics,
      focusedMetric: sorted[0].metric,
      neglectedMetric: sorted[sorted.length - 1].metric,
      bestDay,
      totalActionsThisWeek: thisWeekActions.length,
      totalActionsLastWeek: lastWeekActions.length,
      heatmap,
    }
  }, [actions, defs])
}