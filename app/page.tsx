'use client'

import { useMemo, useState } from 'react';

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

  const handleMetricCardClick = (metricName: MetricKey | "total") => {
    if (metricName === "total") {
      setHighlightedMetric(null);
    } else {
      setHighlightedMetric(metricName);
    }
  };

  function getStreak() {
    let dayHasLog = true
    let daysBack = 0
    while (dayHasLog) {
      daysBack++
      const matchingDays = actions.filter(a => {
        return convertTimestampToDayJS(a.timestamp).isSame(getToday().subtract(daysBack, 'days'), 'day')
      })
      dayHasLog = matchingDays.length > 0
    }
    return daysBack - 1
  }

  function daysSinceLastLog() {
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
          { getStreak() > 7 ? (
            <div
              className="animate-background block rounded-full bg-linear-to-r from-mind via-work to-bond bg-size-[400%_400%] p-1 [animation-duration:3s]"
            >
              <span className="block rounded-full bg-white px-10 py-2 text-center text-base font-semibold">{getStreak() > 0 ? `You're on a ${getStreak()} day log streak! 🔥` : "Great to see you!"}</span>
            </div>
          ) : (
            <div
              className="w-full bg-gray-200 border border-gray-400 rounded-xl py-2 flex items-center justify-center"
            >
              <span className="text-center text-base font-semibold">{getStreak() > 0 ? "Welcome back!" : daysSinceLastLog() > 3 ? "So glad you came back!" : "Great to see you again!"}</span>
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
          <h2 className='mb-2 text-lg font-semibold'>Recent Actions</h2>
          <ActionCardList>
            {actions!
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
      </main>
    </div>
  );
}
