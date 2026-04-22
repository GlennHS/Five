'use client'

import { useEffect, useMemo, useState } from 'react';
import { Clock, Hash } from 'lucide-react';

import { METRIC_KEYS, SettingsSetupResult, type MetricKey } from './types';

import ActionCard from './components/ActionCards/ActionCard';
import ActionCardList from './components/ActionCards/ActionCardList';
import FiveBar from './components/Graphs/FiveBar';
import FiveRadar from './components/Graphs/FiveRadar';
import LoadingSpinner from './components/LoadingSpinner';
import LogModal from './components/LogModal';
import MetricCard from './components/MetricCard';
import SectionDivider from './components/SectionDivider';
import TrackCard from './components/TrackCard';

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
import { useApp } from './context/AppContext';
import { useInsights } from './hooks/useInsights';
import { useTracking } from './hooks/useTracking';

import { ActionController } from './controllers/ActionController';

import { calculateMetricsForRange } from './lib/metrics/calculateMetricsForRange';
import calculateTotal from './lib/metrics/calculateTotal';
import { convertTimestampToDayJS, getAWeekAgo, getToday, getYesterday } from './lib/dateTime';
import { Settings } from './lib/settings';
import { pickRandom, waitForElement } from './lib/utils';

import { randomQuotes } from './constants/Quotes';
import VersionModal from './components/VersionModal';
import { useNextStep } from 'nextstepjs';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function Home() {
  const { actions, actionDefinitions, loading, addAction } = useApp()
  const { modal, trackingMethods } = useTracking(addAction)
  const insights = useInsights(actions, actionDefinitions)

  const [highlightedMetric, setHighlightedMetric] = useState<MetricKey | null>("mind");
  const [streak, setStreak] = useState<number | null>(null)
  const [sortType, setSortType] = useState<string>("chrono")

  const [quote, setQuote] = useState(pickRandom(randomQuotes))

  const chartType = Settings.get("preferedChart")

  const [didCheck, setDidCheck] = useState(false)
  const [showVersionModal, setShowVersionModal] = useState(false)
  const { startNextStep } = useNextStep();

  const handleClose = () => setShowVersionModal(false)

  useEffect(() => {
    if (didCheck) return

    const upgradeStatus = Settings.setup() // Check if they're a new user, if so set them up

    if (upgradeStatus === SettingsSetupResult.TUTORIAL) {
      waitForElement("#chart").then(() => startNextStep("tutorial"))
    } else if (upgradeStatus === SettingsSetupResult.UPGRADE) {
      setShowVersionModal(true)
    }

    setDidCheck(true)
  }, [didCheck])

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
      getToday(),
      false
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

  const actionsToShow = useMemo(() => {
    if (!actions) return []

    const sorted = actions
      .slice()
      .sort((a, b) => {
        if (sortType === 'quantity') {
          const aCount = actionCountMap.get(a.actionId) ?? 0
          const bCount = actionCountMap.get(b.actionId) ?? 0
          return bCount - aCount
        }

        return b.timestamp - a.timestamp
      })

    if (sortType === 'quantity') {
      const seen = new Set<number>()

      return sorted.filter(a => {
        if (seen.has(a.actionId)) return false
        seen.add(a.actionId)
        return true
      }).slice(0, 50)
    }

    return sorted.slice(0, 50)
  }, [actions, sortType, actionCountMap])

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
    <div className="flex items-stretch justify-center bg-zinc-50">
      <main className="flex w-full flex-col gap-4 bg-white">
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
                  className="w-full bg-gray-200 border border-gray-300 rounded-xl py-2 flex items-center justify-center"
                >
                  <span className="text-center text-base font-semibold">{streak > 0 ? "Welcome back!" : daysSinceLastLog() > 3 ? "So glad you came back!" : "Great to see you!"}</span>
                </div>
              )}
            </>
          ) : (
            <div role="status" className="space-y-2.5 w-full bg-gray-200 border border-gray-300 rounded-xl py-4 px-2 flex items-center justify-center">
              <div className="flex items-center w-full">
                  <div className="animate-pulse h-2.5 bg-gray-300 rounded-full w-32"></div>
                  <div className="animate-pulse h-2.5 ms-2 bg-gray-300 rounded-full w-24"></div>
                  <div className="animate-pulse h-2.5 ms-2 bg-gray-300 rounded-full w-full"></div>
              </div>
            </div>
          )}
        </section>

        <section className="w-full rounded-2xl max-h-2/3 h-80" id="chart">
          { chartType === 'radar' && <FiveRadar
            data={metrics}
            highlightedMetric={highlightedMetric}
            onMetricChange={(metric) => setHighlightedMetric(metric)}
          /> }
          { chartType === 'bar' && <FiveBar
            data={metrics}
            highlightedMetric={highlightedMetric}
            onMetricChange={(metric) => setHighlightedMetric(metric)}
          /> }
        </section>

        <section className="w-full max-h-48">
          <div className="grid grid-cols-3 grid-rows-2 gap-4">
            {METRIC_KEYS.map((key) => (
              <MetricCard
                key={key}
                metric={{ name: key, value: metrics![key] }}
                delta={dailyDeltas !== null ? dailyDeltas[key] : undefined}
                isActive={highlightedMetric === key}
                onClick={() => handleMetricCardClick(key)}
                className={`metric-card-${key}`}
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

        { actions.length > 0 && <section>
          <SectionDivider text='Insights' />
          <div className="flex flex-col gap-2">
            {insights.map(insight => (
              <div
                key={insight.id}
                className={`p-3 rounded-lg border ${
                  insight.tone === "positive"
                    ? "bg-green-100"
                    : insight.tone === "negative"
                    ? "bg-red-100"
                    : "bg-gray-100"
                }`}
              >
                {insight.text}
              </div>
            ))}
          </div>
        </section> }

        { /*! BELOW THE FOLD BEYOND HERE !*/ }

        { actions.length > 0 && (
          <section>
            <SectionDivider text='Quick Log' />
            <div>
              {Array.from(actionCountMap.entries())
                .sort((a, b) => b[1] - a[1]) // sort by count desc
                .slice(0, 5)
                .map(m => actionDefinitions.find(d => d.id === m[0]))
                .filter(d => d !== undefined)
                .map((def, i) => (
                  <TrackCard
                    key={def.id}
                    def={def}
                    onLog={trackingMethods.handleQuickLog}
                    onAdvancedLog={trackingMethods.handleAdvancedLog}
                    className={`${i === 0 && 'border-t-2'} ${i === 4 && 'border-b-2'}`}
                    simple
                  />
                ))}
            </div>
          </section>
        )}

        { actions.length > 0 && <section className="w-full">
          <div className='w-full flex flex-col mb-2'>
            <SectionDivider text="Action Log"/>
            <div className="w-full flex items-center justify-end gap-x-4">
              <button
                className={`flex items-center justify-center gap-2 border-2 rounded-xl p-2 ${sortType === 'chrono' ? "opacity-100" : "opacity-50"} transition-opacity duration-500`}
                onClick={() => setSortType('chrono')}
              >
                <Clock /> Recent
              </button>
              <button
                className={`flex items-center justify-center gap-2 border-2 rounded-xl p-2 ${sortType === 'quantity' ? "opacity-100" : "opacity-30"} transition-opacity duration-500`}
                onClick={() => setSortType('quantity')}
              >
                <Hash /> Frequent
              </button>
            </div>
          </div>
          <ActionCardList>
            {actionsToShow
              .map(action => {
                const def = actionDefinitions.find(def => def.id === action.actionId)

                if (def)
                  return (
                    <ActionCard
                      key={action.id}
                      action={action}
                      quantity={sortType === 'quantity' ? actionCountMap.get(def.id) : -1}
                    />
                  )
                else
                  return
              }
            )}
          </ActionCardList>
        </section> }

        <section className="w-full mt-24">
          <div className='w-full flex flex-col items-center mb-1'>
            <SectionDivider />
            <blockquote className='italic px-12 text-black opacity-50 text-center text-sm'>{ quote }</blockquote>
          </div>
        </section>
      </main>
      <LogModal
        def={modal.actionToAdvancedLog}
        isOpen={modal.logModalShowing}
        onClose={() => trackingMethods.setLogModalShowing(false)}
        onSubmit={trackingMethods.handleModalSubmit}
      />
      { showVersionModal && <VersionModal onClose={handleClose} /> }
    </div>
  );
}
