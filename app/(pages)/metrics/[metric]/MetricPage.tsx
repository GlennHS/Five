"use client"

import MetricHeader from "@/app/components/Metrics/MetricHeader"
import ScoreCard from "@/app/components/Metrics/ScoreCard"
import WeeklySummary from "@/app/components/Metrics/WeeklySummary"
import ActionsList from "@/app/components/Metrics/ActionsList"
import AboutSection from "@/app/components/Metrics/AboutSection"
import { Action, MetricKey } from "@/app/types"
import { useApp } from "@/app/context/AppContext"
import definitionAffectsMetric from "@/app/lib/actionDefinitions/definitionAffectsMetric"
import { useMemo } from "react"
import TrendChart from "@/app/components/Metrics/TrendChart"
import { getAWeekAgo, getToday, getYesterday } from "@/app/lib/dateTime"
import { calculateMetricsForRange } from "@/app/lib/metrics/calculateMetricsForRange"

export default function MetricPage({ metric }: { metric: MetricKey }) {

  const { actions, actionDefinitions } = useApp()

  const relevantDefinitions: number[] = useMemo(() => {
    return actionDefinitions.filter(def => definitionAffectsMetric(def, metric)).map(def => def.id)
  }, [actionDefinitions])

  const filteredActions: Action[] = useMemo(() => {
    return actions.filter(a => relevantDefinitions.includes(a.actionId))
  }, [actions])

  // TODO: wire these to your hooks
  const score = calculateMetricsForRange(actions, actionDefinitions, getAWeekAgo(), getToday(), true)[metric]
  const dailyChange = calculateMetricsForRange(actions, actionDefinitions, getYesterday(), getToday(), false)[metric]
  const weeklyChange = calculateMetricsForRange(actions, actionDefinitions, getAWeekAgo(), getToday(), false)[metric]
  const trendData = [12, 24, 28, 22, 25, 26, 15]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-6 space-y-6">
      <MetricHeader metric={metric} />

      <ScoreCard score={score} dailyChange={dailyChange} metric={metric}/>

      <WeeklySummary weeklyChange={weeklyChange} metric={metric} />

      {/* <TrendChart data={trendData} weeklyChange={weeklyChange} /> */}

      <ActionsList actions={filteredActions} metric={metric} />

      <AboutSection metric={metric} />
    </div>
  )
}