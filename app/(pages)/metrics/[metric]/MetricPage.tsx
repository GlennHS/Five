'use client'

import { actionAffectsMetric, getMetricScore, getMetricSeries, toSentenceCase } from '@/app/utils/helpers'
import FiveLineGraph from '@/app/components/graphs/FiveLineGraph'
import { getAWeekAgo, getToday } from '@/app/utils/dateTime'
import { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import { Action, MetricKey, TIME_GROUPS } from '@/app/types'
import BackLink from '@/app/components/BackLink'
import LoadingSpinner from '@/app/components/LoadingSpinner'
import { useApp } from '@/app/context/AppContext'
import ActionCard from '@/app/components/actionCards/ActionCard'

export default function MetricPage({
  metric,
}: {
  metric: MetricKey
}) {
  const { actions, actionDefinitions, loading } = useApp()

  const filteredActions: Action[] = useMemo<Action[]>((): Action[] => {
    return actions.filter(action => actionAffectsMetric(action, actionDefinitions, metric))
  }, [actions])

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

          <div
            className="min-h-50 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-2 text-slate-500 flex flex-col gap-2"
            aria-label="Action cards container"
          >
            {filteredActions
              .slice()
              .sort((a,b) => b.timestamp - a.timestamp)
              .slice(0,5)
              .map(action => (
                <ActionCard
                  key={action.id}
                  action={action}
                  definitions={actionDefinitions}
                />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <h2 className="mb-1 text-base font-semibold text-slate-900">
            About {metric}
          </h2>

          <p>
            Track and improve this area with small, consistent actions. Use the
            graph above to spot patterns and the action cards to choose what to
            do next.
          </p>
        </section>
      </section>
    </main>
  )
}