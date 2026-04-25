"use client"

import { useMemo } from "react"
import { Action, DailyMetric, MetricKey } from "@/app/types"
import { useApp } from "@/app/context/AppContext"
import AboutSection from "@/app/components/Metrics/AboutSection"
import ActionsList from "@/app/components/Metrics/ActionsList"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import MetricHeader from "@/app/components/Metrics/MetricHeader"
import ScoreCard from "@/app/components/Metrics/ScoreCard"
import TrendChart from "@/app/components/Metrics/TrendChart"
import WeeklySummary from "@/app/components/Metrics/WeeklySummary"
import definitionAffectsMetric from "@/app/lib/actionDefinitions/definitionAffectsMetric"
import { getAWeekAgo, getToday, isDateBetween } from "@/app/lib/dateTime"
import dayjs from "dayjs"
import { getDailyMetric } from "@/app/lib/metrics/getDailyMetric"
import { applyBonusToMetric } from "@/app/lib/metrics/applyBonusToMetric"

export default function MetricPage({ metric }: { metric: MetricKey }) {

  const { actions, actionDefinitions, loading } = useApp()

  const relevantDefinitions: number[] = useMemo(() => {
    return actionDefinitions.filter(def => definitionAffectsMetric(def, metric)).map(def => def.id)
  }, [actionDefinitions])

  const filteredActions: Action[] = useMemo(() => {
    return actions
      .filter(a => isDateBetween(dayjs(a.timestamp), getToday(), getAWeekAgo()))
      .filter(a => relevantDefinitions.includes(a.actionId))
  }, [actions])

  let metricsForWeek: DailyMetric[] = []

  for (let i = 0; i < 7; i++) {
    metricsForWeek.push(getDailyMetric(filteredActions, actionDefinitions, metric, getToday().subtract(6 - i, 'days')))
  }

  // const score = calculateMetricsForRange(actions, actionDefinitions, getAWeekAgo(), getToday(), true)[metric]
  const score = applyBonusToMetric(metricsForWeek.map((m:DailyMetric) => m.value).reduce((a,b) => a + b))
  const dailyChange = metricsForWeek[metricsForWeek.length - 1].value
  const weeklyChange = metricsForWeek.map((m:DailyMetric) => m.value).reduce((a,b) => a + b)
  const trendData = () => {
    const out: number[] = []
    let runningTotal: number = 0

    metricsForWeek.forEach(m => {
      runningTotal += m.value
      out.push(applyBonusToMetric(runningTotal))
    })

    return out
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-6 space-y-6">
      <MetricHeader metric={metric} />

      <ScoreCard score={score} dailyChange={dailyChange} metric={metric}/>

      <WeeklySummary weeklyChange={weeklyChange} metric={metric} />

      <TrendChart data={trendData()} weeklyChange={weeklyChange} metric={metric} />

      <ActionsList actions={filteredActions} metric={metric} />

      <AboutSection metric={metric} />
    </div>
  )
}