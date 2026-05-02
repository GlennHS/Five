"use client"

import { ReactNode, useMemo } from "react"
import { Action, ActionDefinition, Metric, METRIC_KEYS, MetricKey } from "@/app/types"
import definitionAffectsMetric from "../lib/actionDefinitions/definitionAffectsMetric"
import { Calendar, ChartColumnIncreasing, Flame, LucideIcon, Star } from "lucide-react"
import { METRIC_INFO } from "../constants/Constants"
import { calculateMetricsForRange } from "../lib/metrics/calculateMetricsForRange"
import { getAWeekAgo, getToday, getYesterday, toDay } from "../lib/dateTime"
import getDominantMetric from "../lib/metrics/getDominantMetric"
import isActionNegative from "../lib/actionDefinitions/isActionNegative"
import dayjs from "dayjs"

export const INSIGHT_CATEGORIES = ["performance", "attribution", "habit", "achievement"] as const
export type InsightCategory = typeof INSIGHT_CATEGORIES[number]

export type Insight = {
  id: string
  icon: LucideIcon
  text: ReactNode
  tone: "positive" | "negative" | "neutral"
  priority: number
  category: InsightCategory
  metric?: MetricKey
}

function getTopMetric(
  actions: Action[],
  defs: ActionDefinition[]
): {
  metric: MetricKey,
  value: number
} | null {
  const metrics = calculateMetricsForRange(actions, defs, getToday(), getAWeekAgo(), false, false)
  let topMetric : {
    metric: MetricKey,
    value: number
  } = {
    metric: "mind",
    value: -100,
  } // Yes... I really have to hard-type this because TypeScript is stupid
  METRIC_KEYS.forEach(key => {
    if (metrics[key] > topMetric.value) {
      topMetric.metric = key as MetricKey
      topMetric.value = metrics[key]
    }
  })

  if (topMetric.value <= 0) return null

  return topMetric
}

function getLowestMetric(
  actions: Action[],
  defs: ActionDefinition[]
): {
  metric: MetricKey,
  value: number
} | null {
  const metrics = calculateMetricsForRange(actions, defs, getToday(), getToday().subtract(3, 'days'), false, false, true)
  let lowestMetric : {
    metric: MetricKey,
    value: number
  } = {
    metric: "mind",
    value: 100,
  } // Yes... I really have to hard-type this because TypeScript is stupid
  METRIC_KEYS.forEach(key => {
    if (metrics[key] < lowestMetric.value) {
      lowestMetric.metric = key as MetricKey
      lowestMetric.value = metrics[key]
    }
  })

  if (lowestMetric.value >= 0) return null

  return lowestMetric
}

function getNeglectedMetric(
  actions: Action[],
  defs: ActionDefinition[]
): {
  metric: MetricKey,
  days: number
} | null {
  const now = Date.now()

  let worst: { metric: MetricKey; days: number } | null = null as { metric: MetricKey; days: number } | null

  METRIC_KEYS.forEach(metric => {
    const last = actions
      .filter(a => {
        const def = defs.find(d => d.id === a.actionId)
        return def ? definitionAffectsMetric(def, metric) : false
      })
      .sort((a, b) => b.timestamp - a.timestamp)[0]

    if (!last) return

    const days = Math.floor((now - last.timestamp) / (1000 * 60 * 60 * 24))

    if (!worst || days > worst.days) {
      worst = { metric: metric as MetricKey, days }
    }
  })

  if (!worst || worst.days < 3) return null

  return worst
}

function getTopAction(actions: Action[], defs: ActionDefinition[]) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

  const counts = new Map<number, number>()

  actions
    .filter(a => a.timestamp >= weekAgo)
    .forEach(a => {
      counts.set(a.actionId, (counts.get(a.actionId) || 0) + 1)
    })

  const top = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]

  if (!top) return null

  const def = defs.find(d => d.id === top[0])
  if (!def) return null

  return { definition: def, count: top[1] }
}

function getStreak(actions: Action[]) {
  if (actions.length === 0) return 0
  const days = new Set(actions.map(a => toDay(a.timestamp)))

  let streak = 0
  let currentDay = toDay(Date.now())

  if (days.has(currentDay)) streak++
  while (days.has(currentDay - 1)) {
    streak++
    currentDay--
  }


  return streak
}

function getBiggestGain(actions: Action[], definitions: ActionDefinition[], metric: MetricKey) {
  const relevantDefs = definitions.filter(d => definitionAffectsMetric(d, metric))
  const relevantActions = actions
    .filter(a => relevantDefs.map(d => d.id).includes(a.actionId)) // affects metric
    .filter(a => a.timestamp > getAWeekAgo().valueOf()) // within a week
  
  const actionCount: Record<number, number> = {} // <DefId, Count>
  relevantActions.forEach(a => {
    if (!actionCount[a.actionId]) actionCount[a.actionId] = 1
    else actionCount[a.actionId]++
  })

  const defMetricWorth: Record<number, number> = {} // <DefId, MetricValue>
  relevantDefs.forEach(d => defMetricWorth[d.id] = d[metric] ?? 0)

  let mostImpactfulAction = {
    definition: relevantDefs[0],
    value: -1
  }

  relevantDefs.forEach(d => {
    const totalChange = actionCount[d.id] * defMetricWorth[d.id]
    if (totalChange > mostImpactfulAction.value)
      mostImpactfulAction = {
        definition: d,
        value: totalChange
      }
  })

  return mostImpactfulAction
}

function getBiggestLoss(actions: Action[], definitions: ActionDefinition[], metric: MetricKey) {
  const relevantDefs = definitions.filter(d => definitionAffectsMetric(d, metric))
  const relevantActions = actions
    .filter(a => relevantDefs.map(d => d.id).includes(a.actionId))
    .filter(a => a.timestamp > getAWeekAgo().valueOf())

  const actionCount: Record<number, number> = {}
  relevantActions.forEach(a => {
    actionCount[a.actionId] = (actionCount[a.actionId] ?? 0) + 1
  })

  let mostDamagingAction: { definition: ActionDefinition; value: number } | null = {
    definition: definitions[0],
    value: 100,
  }

  relevantDefs.forEach(d => {
    const metricValue = d[metric] ?? 0
    if (metricValue >= 0) return // only care about negatives
    const totalChange = (actionCount[d.id] ?? 0) * metricValue
    if (totalChange < 0 && (!mostDamagingAction || totalChange < mostDamagingAction.value)) {
      mostDamagingAction = { definition: d, value: totalChange }
    }
  })

  return mostDamagingAction
}

function getDaysLoggedCalendarMonth(actions: Action[]): {
  daysLogged: number
  daysInPeriod: number
  isEarlyMonth: boolean
} {
  const now = getToday()
  const dayOfMonth = now.date()
  const isEarlyMonth = dayOfMonth <= 7

  if (isEarlyMonth) {
    // Last calendar month
    const startOfLastMonth = now.subtract(1, 'month').startOf('month')
    const endOfLastMonth = now.subtract(1, 'month').endOf('month')
    const daysInLastMonth = endOfLastMonth.date()

    const uniqueDays = new Set(
      actions
        .filter(a => {
          const d = dayjs(a.timestamp)
          return d.isAfter(startOfLastMonth.subtract(1, 'ms')) && d.isBefore(endOfLastMonth.add(1, 'ms'))
        })
        .map(a => toDay(a.timestamp))
    )

    return { daysLogged: uniqueDays.size, daysInPeriod: daysInLastMonth, isEarlyMonth: true }
  } else {
    // This calendar month so far
    const startOfMonth = now.startOf('month').valueOf()

    const uniqueDays = new Set(
      actions
        .filter(a => a.timestamp >= startOfMonth)
        .map(a => toDay(a.timestamp))
    )

    return { daysLogged: uniqueDays.size, daysInPeriod: dayOfMonth, isEarlyMonth: false }
  }
}

function getLongestSingleActionStreak(
  actions: Action[],
  defs: ActionDefinition[]
): { definition: ActionDefinition; streak: number } | null {
  let best: { definition: ActionDefinition; streak: number } | null = null

  defs.forEach(def => {
    const days = new Set(
      actions
        .filter(a => a.actionId === def.id)
        .map(a => toDay(a.timestamp))
    )

    if (days.size === 0) return

    // Walk backwards from today counting consecutive days
    let streak = 0
    let current = toDay(Date.now())

    // Allow streak to start from today or yesterday
    // (same grace period logic as getStreak)
    if (days.has(current)) streak++
    while (days.has(current - 1)) {
      streak++
      current--
    }

    if (streak > 0 && (!best || streak > best.streak)) {
      best = { definition: def, streak }
    }
  })

  return best
}

// --- Main hook ---

export function useInsights(
  actions: Action[],
  defs: ActionDefinition[]
) {
  return useMemo(() => {
    const insights: Insight[] = []
    /**
     * ==TODO==
     * X Biggest loss
     * X Days logged out of past month
     * X Longest single-action streak
     */

    // #region Performance Insights
    // Top metric - Highest metric score
    const topMetric = getTopMetric(actions, defs)
    if (topMetric) {
      insights.push({
        id: "top-metric",
        icon: METRIC_INFO[topMetric.metric].icon,
        text: <>You've focused on <span className="font-bold">{ topMetric.metric.toUpperCase() }</span> recently (+{ topMetric.value })</>,
        tone: "positive",
        priority: 1,
        category: "performance",
        metric: topMetric.metric
      })
    }
    
    // Lowest metric - Lowest metric score
    const lowestMetric = getLowestMetric(actions, defs)
    if (lowestMetric) {
      insights.push({
        id: "lowest-metric",
        icon: METRIC_INFO[lowestMetric.metric].icon,
        text: <>You've neglected <span className="font-bold">{ lowestMetric.metric.toUpperCase() }</span> the past few days ({ lowestMetric.value })</>,
        tone: "negative",
        priority: 3,
        category: "performance",
        metric: lowestMetric.metric
      })
    }

    // Neglected metric - metric that hasn't been touched the longest
    const neglected = getNeglectedMetric(actions, defs)
    if (neglected) {
      insights.push({
        id: "neglected-metric",
        icon: METRIC_INFO[neglected.metric].icon,
        text: <>You haven't touched <span className="font-bold">{ neglected.metric.toUpperCase() }</span> in { neglected.days } days</>,
        tone: "negative",
        priority: 2,
        category: "performance",
        metric: neglected.metric
      })
    }
    // #endregion

    // #region Attribution Insights
    METRIC_KEYS.forEach(key => {
      const biggestGain = getBiggestGain(actions, defs, key)
      if (biggestGain.value > 0) {
        insights.push({
          id: `${key}-top-impact`,
          icon: METRIC_INFO[key].icon,
          text: <>Your greatest <span className="font-bold">{ key.toUpperCase() }</span> increase came from <span className="font-bold">{ biggestGain.definition?.name ?? "" }</span> [+{ biggestGain.value }]</>,
          tone: 'positive',
          priority: 1,
          category: "attribution",
          metric: key
        })
      }
    })

    METRIC_KEYS.forEach(key => {
    const biggestLoss = getBiggestLoss(actions, defs, key)
    if (biggestLoss && biggestLoss.definition !== undefined) {
      insights.push({
        id: `${key}-biggest-loss`,
        icon: METRIC_INFO[key].icon,
        text: <>Your greatest <span className="font-bold">{key.toUpperCase()}</span> decrease came from <span className="font-bold">{biggestLoss.definition.name}</span> [{biggestLoss.value}]</>,
        tone: "negative",
        priority: 2,
        category: "attribution",
        metric: key
      })
    }
  })
    // #endregion

    // #region Habit Insights
    // Most frequent action
    const mostFrequentAction = getTopAction(actions, defs)
    if (mostFrequentAction) {
      const dominantMetric = getDominantMetric(mostFrequentAction.definition)
      const isNegative = isActionNegative(mostFrequentAction.definition)
      insights.push({
        id: "worst-action",
        icon: dominantMetric ? METRIC_INFO[dominantMetric].icon : ChartColumnIncreasing,
        text: <>Your most logged action this week is <span className="font-bold">{ mostFrequentAction.definition.name }</span></>,
        tone: isNegative ? 'negative' : 'positive',
        priority: 3,
        category: "habit",
        metric: dominantMetric ?? undefined
      })
    }

    // Days logged this month
    const { daysLogged, daysInPeriod, isEarlyMonth } = getDaysLoggedCalendarMonth(actions)
    const pct = Math.round((daysLogged / daysInPeriod) * 100)
    const isGood = pct > 50

    if (daysLogged > 0) {
      const periodLabel = isEarlyMonth ? "last month" : "this month"
      const prefix = isGood ? "Great work! You've" : "You've"

      insights.push({
        id: "days-logged",
        icon: pct === 100 ? Star : Calendar,
        text: `${pct === 100 ? `Amazing! You logged actions every single day ${periodLabel}` : `${prefix} logged actions on ${daysLogged} of ${daysInPeriod} days ${periodLabel} (${pct}%)`}`,
        tone: isGood ? "positive" : "neutral",
        priority: 3,
        category: "habit",
      })
    }

    // Longest single action streak
    const longestStreak = getLongestSingleActionStreak(actions, defs)
    if (longestStreak && longestStreak.streak >= 2) {
      const dominantMetric = getDominantMetric(longestStreak.definition)
      insights.push({
        id: "single-action-streak",
        icon: Flame,
        text: `You've logged "${longestStreak.definition.name}" for ${longestStreak.streak} days in a row`,
        tone: "positive",
        priority: 4,
        category: "habit",
        metric: dominantMetric ?? undefined
      })
    }
    // #endregion

    // #region Achievement Insights
    // Current Streak
    const streak = getStreak(actions)
    if (streak >= 1) {
      insights.push({
        id: "streak",
        icon: Flame,
        text: <>You're on a <span className="font-bold">{streak}</span> day streak!</>,
        tone: 'positive',
        priority: 2,
        category: "achievement",
        metric: "body"
      })
    }
    // #endregion

    // sort + limit
    return insights
      .sort((a, b) => a.priority - b.priority)

  }, [actions, defs])
}
