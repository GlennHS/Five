"use client"

import { useMemo } from "react"
import { Action, ActionDefinition, METRIC_KEYS } from "@/app/types"
import definitionAffectsMetric from "../lib/actionDefinitions/definitionAffectsMetric"

type Insight = {
  id: string
  text: string
  tone: "positive" | "negative" | "neutral"
  priority: number
}

// --- Helpers (pure functions) ---

function getTopMetric(actions: Action[], defs: ActionDefinition[]) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

  const totals: Record<string, number> = {}

  actions
    .filter(a => a.timestamp >= weekAgo)
    .forEach(a => {
      const def = defs.find(d => d.id === a.actionId)
      if (!def) return

      METRIC_KEYS.forEach(metric => {
        totals[metric] = (totals[metric] || 0) + (def[metric] || 0)
      })
    })

  const top = Object.entries(totals).sort((a, b) => b[1] - a[1])[0]

  if (!top || top[1] === 0) return null

  return { metric: top[0], value: top[1] }
}

function getNeglectedMetric(actions: Action[], defs: ActionDefinition[]) {
  const now = Date.now()

  let worst: { metric: string; days: number } | null = null as { metric: string; days: number } | null

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
      worst = { metric, days }
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

  return { name: def.name, count: top[1] }
}

function getStreak(actions: Action[]) {
  const days = new Set(
    actions.map(a => new Date(a.timestamp).toDateString())
  )

  return days.size
}

// --- Main hook ---

export function useInsights(
  actions: Action[],
  defs: ActionDefinition[]
) {
  return useMemo(() => {
    const insights: Insight[] = []

    // 📈 Top metric
    const topMetric = getTopMetric(actions, defs)
    if (topMetric) {
      insights.push({
        id: "top-metric",
        text: `You've focused on ${topMetric.metric} recently (+${topMetric.value})`,
        tone: "positive",
        priority: 3
      })
    }

    // 📉 Neglected metric
    const neglected = getNeglectedMetric(actions, defs)
    if (neglected) {
      insights.push({
        id: "neglected",
        text: `You haven't touched ${neglected.metric} in ${neglected.days} days`,
        tone: "negative",
        priority: 4
      })
    }

    // 🧠 Top action
    const topAction = getTopAction(actions, defs)
    if (topAction) {
      insights.push({
        id: "top-action",
        text: `Your most logged action this week is ${topAction.name}`,
        tone: "neutral",
        priority: 1
      })
    }

    // sort + limit
    return insights
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3)

  }, [actions, defs])
}