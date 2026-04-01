'use client'

import { useEffect, useMemo, useState } from 'react';

// Types
import { Action, ActionDefinition, METRIC_KEYS, type MetricKey } from './types';

// Components
import FiveBarGraph from './components/graphs/FiveBarGraph';
import MetricCard from './components/MetricCard';

// ChartJS
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
import { calculateMetricsForRange, calculateTotal, hydrateActionDefinitions, hydrateActions } from './utils/helpers';
import { getAWeekAgo, getToday } from './utils/dateTime';
import ActionCard from './components/actionCards/ActionCard';
import { ActionController } from './controllers/ActionController';
import LoadingSpinner from './components/LoadingSpinner';
import { ActionDefinitionController } from './controllers/ActionDefinitionController';
import { TagController } from './controllers/TagController';
import { useApp } from './context/AppContext';

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

  const handleMetricCardClick = (metricName: MetricKey | "total") => {
    if (metricName === "total") {
      setHighlightedMetric(null);
    } else {
      setHighlightedMetric(metricName);
    }
  };

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

        <section className="w-full">
          <div className="grid grid-cols-3 grid-rows-2 gap-4">
            {METRIC_KEYS.map((key) => (
              <MetricCard
                key={key}
                metric={{ name: key, value: metrics![key] }}
                isActive={highlightedMetric === key}
                onClick={() => handleMetricCardClick(key)}
              />
            ))}
            <MetricCard
              metric={{name: "total", value: total ?? 0}}
              isActive={highlightedMetric === null}
            />
          </div>
        </section>
        <section className="flex flex-col w-full rounded-2xl py-4 max-h-2/3 gap-y-4">
          {actions!
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
        </section>
      </main>
    </div>
  );
}
