'use client'

import { useMemo, useState } from 'react'

import { Action, MetricKey, TIME_GROUPS } from '@/app/types'
import { Dayjs } from 'dayjs'

import { useApp } from '@/app/context/AppContext'

import ActionCard from '@/app/components/actionCards/ActionCard'
import BackLink from '@/app/components/BackLink'
import FiveLineGraph from '@/app/components/graphs/FiveLineGraph'
import LoadingSpinner from '@/app/components/LoadingSpinner'

import actionAffectsMetric from '@/app/lib/actions/actionAffectsMetric'
import getMetricScore from '@/app/lib/metrics/getMetricScore'
import getMetricSeries from '@/app/lib/metrics/getMetricSeries'
import { getAWeekAgo, getToday } from '@/app/lib/dateTime'
import { toSentenceCase } from '@/app/lib/utils'
import ActionCardList from '@/app/components/actionCards/ActionCardList'
import { METRIC_INFO_TEXT } from '@/app/constants/Constants'
import { calculateMetricsForRange } from '@/app/lib/metrics/calculateMetricsForRange'

export default function MetricPage({
  metric,
}: {
  metric: MetricKey
}) {
  const { actions, actionDefinitions, loading } = useApp()

  const filteredActions: Action[] = useMemo<Action[]>((): Action[] => {
    return actions.filter(action => {
      const def = actionDefinitions.find(d => d.id === action.id) 
      return def ? actionAffectsMetric(def, metric) : false
    })
  }, [actions])

  const totalDelta = useMemo(() => {
    const metricsForWeek = calculateMetricsForRange(actions, actionDefinitions, getAWeekAgo(), getToday(), false)
    return metricsForWeek[metric]
  }, [actions, actionDefinitions])

  const [fromDate, setFromDate] = useState<Dayjs>(getAWeekAgo())
  const [toDate, setToDate] = useState<Dayjs>(getToday())
  const [timeGroup, setTimeGroup] = useState<string>("week")

  if (loading) return (
    <div className="p-6">
      <LoadingSpinner />
    </div>
  )

  return (
    <main className="min-h-screen w-full bg-white px-4 py-6">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <BackLink />

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 uppercase">
            {metric}
          </h1>

          <p className="text-sm text-slate-600">
            Current score:
            <span className="font-semibold text-slate-900">
              {getMetricScore(actions, actionDefinitions, metric, fromDate, toDate)}
            </span>
          </p>

          {totalDelta > 0 ? (
            <span>Great work, this week your metric changed by +{totalDelta}!</span>
          ) : (
            <span>This week your metric changed by {totalDelta}</span>
          )}
        </header>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Trend (this week)
          </h2>

          <div className="h-64 w-full">
            <FiveLineGraph data={getMetricSeries(actions, actionDefinitions, metric, fromDate, toDate, 'day')} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex gap-2 items-center justify-between">
          {TIME_GROUPS.map(group => (
            <button
              key={group}
              className={`rounded-lg border border-gray-600 px-3 py-1 transition-colors duration-500 ${timeGroup === group ? 'bg-gray-400' : 'bg-white'}`}
              onClick={() => setTimeGroup(group)}
            >
              Past {toSentenceCase(group)}
            </button>
          ))}
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-slate-700">
            Recent Actions
          </h2>

          <ActionCardList>
            {filteredActions
              .slice()
              .sort((a,b) => b.timestamp - a.timestamp)
              .slice(0,50)
              .map(action => {
                const def = actionDefinitions.find(def => def.id === action.actionId)

                if (def)
                  return (
                    <ActionCard
                      key={action.id}
                      action={action}
                      definition={def}
                    />
                  )
                else
                  return
              }
            )}
          </ActionCardList>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <h2 className="mb-1 text-base font-semibold text-slate-900">
            About {metric}
          </h2>

          <p>
            {METRIC_INFO_TEXT[metric]}
          </p>
        </section>
      </section>
    </main>
  )
}