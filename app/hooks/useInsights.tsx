"use client"

import { ReactNode, useMemo } from "react"
import { Action, ActionDefinition, Metric, METRIC_KEYS, MetricKey } from "@/app/types"
import definitionAffectsMetric from "../lib/actionDefinitions/definitionAffectsMetric"
import { ChartColumnIncreasing, Flame, LucideIcon } from "lucide-react"
import { METRIC_INFO } from "../constants/Constants"
import { calculateMetricsForRange } from "../lib/metrics/calculateMetricsForRange"
import { getAWeekAgo, getToday, getYesterday, toDay } from "../lib/dateTime"
import getDominantMetric from "../lib/metrics/getDominantMetric"
import isActionNegative from "../lib/actionDefinitions/isActionNegative"

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
  console.log("metrics", metrics)
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

  console.log(lowestMetric)

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
          priority: 6,
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
