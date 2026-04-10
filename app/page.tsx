'use client'

import { useEffect, useMemo, useState } from 'react';

import { METRIC_KEYS, type MetricKey } from './types';

import FiveBarGraph from './components/graphs/FiveBarGraph';
import MetricCard from './components/MetricCard';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Helpers
import { convertTimestampToDayJS, getAWeekAgo, getToday, getYesterday } from './lib/dateTime';
import ActionCard from './components/actionCards/ActionCard';
import LoadingSpinner from './components/LoadingSpinner';
import { useApp } from './context/AppContext';
import { calculateMetricsForRange } from './lib/metrics/calculateMetricsForRange';
import calculateTotal from './lib/metrics/calculateTotal';
import ActionCardList from './components/actionCards/ActionCardList';
import { ActionController } from './controllers/ActionController';
import { Clock, Hash } from 'lucide-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function Home() {
  const { actions, actionDefinitions, loading } = useApp()
  const [highlightedMetric, setHighlightedMetric] = useState<MetricKey | null>(null)
  const [streak, setStreak] = useState<number | null>(null)
  const [sortType, setSortType] = useState<string>("chrono")

  const metrics = useMemo(() => {
    if (!actions) return null

    return calculateMetricsForRange(
      actions,
      actionDefinitions,
      getAWeekAgo(),
      getToday()
    )
  }, [actions])

  const total = useMemo(() => {
    if (!actions) return null

    return calculateTotal(
      actions,
      actionDefinitions,
      getAWeekAgo(),
      getToday()
    )
  }, [actions])

  const dailyDeltas = useMemo(() => {
    if (!actions) return null

    return calculateMetricsForRange(
      actions,
      actionDefinitions,
      getYesterday(),
      getToday()
    )
  }, [actions])

  const totalDelta = useMemo(() => {
    if (!actions) return null

    let d = 0
    METRIC_KEYS.forEach(key => {
      if (dailyDeltas !== null)
        d += dailyDeltas[key]
    })

    return d / METRIC_KEYS.length
  }, [dailyDeltas])

  const actionCountMap = useMemo(() => {
    const map = new Map<number, number>() // actionId -> count

    actions.forEach(a => {
      map.set(a.actionId, (map.get(a.actionId) ?? 0) + 1)
    })

    return map
  }, [actions])

  const handleMetricCardClick = (metricName: MetricKey | "total") => {
    if (metricName === "total") {
      setHighlightedMetric(null);
    } else {
      setHighlightedMetric(metricName);
    }
  };

  function daysSinceLastLog() {
    if (actions.length === 0) return 0
    let dayHasNoLog = true
    let daysBack = 0
    while (dayHasNoLog) {
      daysBack++
      const matchingDays = actions.filter(a => {
        return convertTimestampToDayJS(a.timestamp).isSame(getToday().subtract(daysBack, 'days'), 'day')
      })
      dayHasNoLog = matchingDays.length === 0
    }
    return daysBack - 1
  }

  useEffect(() => {
    ActionController.calculateStreak().then(result => setStreak(result))
  }, [])

  if (loading) return (
    <div className="p-6">
      <LoadingSpinner />
    </div>
  )

  return (
    <div className="flex min-h-screen items-stretch justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full sm:max-w-3xl flex-col gap-6 p-4 bg-white">
        <section className="w-full rounded-2xl max-h-2/3 h-64">
          <FiveBarGraph
            data={metrics}
            highlightedMetric={highlightedMetric}
            onMetricChange={(metric) => setHighlightedMetric(metric)}
          />
        </section>

        <section className='w-full'>
          { streak !== null ? (
            <>
              { streak > 7 ? (
                <div
                  className="animate-background block rounded-full bg-linear-to-r from-mind via-work to-bond bg-size-[400%_400%] p-1 [animation-duration:3s]"
                >
                  <span className="block rounded-full bg-white px-10 py-2 text-center text-base font-semibold">{`You're on a ${streak} day log streak! 🔥`}</span>
                </div>
              ) : (
                <div
                  className="w-full bg-gray-200 border border-gray-400 rounded-xl py-2 flex items-center justify-center"
                >
                  <span className="text-center text-base font-semibold">{streak > 0 ? "Welcome back!" : daysSinceLastLog() > 3 ? "So glad you came back!" : "Great to see you again!"}</span>
                </div>
              )}
            </>
          ) : (
            <div role="status" className="space-y-2.5 w-full bg-gray-200 border border-gray-400 rounded-xl py-4 px-2 flex items-center justify-center">
              <div className="flex items-center w-full">
                  <div className="animate-pulse h-2.5 bg-gray-400 rounded-full w-32"></div>
                  <div className="animate-pulse h-2.5 ms-2 bg-gray-400 rounded-full w-24"></div>
                  <div className="animate-pulse h-2.5 ms-2 bg-gray-400 rounded-full w-full"></div>
              </div>
            </div>
          )}
        </section>

        <section className="w-full">
          <div className="grid grid-cols-3 grid-rows-2 gap-4">
            {METRIC_KEYS.map((key) => (
              <MetricCard
                key={key}
                metric={{ name: key, value: metrics![key] }}
                delta={dailyDeltas !== null ? dailyDeltas[key] : undefined}
                isActive={highlightedMetric === key}
                onClick={() => handleMetricCardClick(key)}
              />
            ))}
            <MetricCard
              metric={{name: "total", value: total ?? 0}}
              delta={totalDelta !== null ? totalDelta : undefined}
              isTotal={true}
              isActive={false}
            />
          </div>
        </section>
        <section className="w-full">
          <div className='w-full flex items-center justify-between mb-2'>
            <h2 className='w-full mb-2 text-lg font-semibold'>Recent Actions</h2>
            <div className="w-full flex items-center justify-end gap-x-4">
              <button
                className={`border-2 rounded-xl p-2 ${sortType === 'chrono' ? "opacity-100" : "opacity-50"}`}
                onClick={() => setSortType('chrono')}
              >
                <Clock />
              </button>
              <button
                className={`border-2 rounded-xl p-2 ${sortType === 'quantity' ? "opacity-100" : "opacity-50"}`}
                onClick={() => setSortType('quantity')}
              >
                <Hash />
              </button>
            </div>
          </div>
          <ActionCardList>
            {actions!
              .slice()
              .sort((a,b) => {
                if (sortType === 'quantity') {
                  if (actionCountMap.get(a.actionId) === undefined || actionCountMap.get(b.actionId) === undefined) return 0
                  if (actionCountMap.get(a.actionId) > actionCountMap.get(b.actionId))
                }
                else return b.timestamp - a.timestamp // return chrono sort by default
              })
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
      </main>
    </div>
  );
}
