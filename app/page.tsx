'use client'

import { useState } from 'react';

// Types
import { METRIC_KEYS, type MetricKey } from './types';

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
import { calculateMetricsForRange, calculateTotal } from './utils/helpers';
import { actionDefinitions, actionHistory } from './fixtures/AppData';
import { getAWeekAgo, getToday } from './utils/dateTime';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function Home() {
  const [highlightedMetric, setHighlightedMetric] = useState<MetricKey | null>(null);

  // const metrics = getMetricsFromSnapshot(metricSnapshots.day);
  const metrics = calculateMetricsForRange(actionHistory, actionDefinitions, getAWeekAgo(), getToday());
  const total = calculateTotal(metrics)

  const handleMetricCardClick = (metricName: MetricKey | "total") => {
    if (metricName === "total") {
      setHighlightedMetric(null);
    } else {
      setHighlightedMetric(metricName);
    }
  };

  return (
    <div className="flex min-h-screen items-stretch justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full sm:max-w-3xl flex-col gap-6 p-4 bg-white">
        <section className="flex-1 w-full rounded-2xl bg-slate-50 p-4 max-h-2/3">
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
                metric={{ name: key, value: metrics[key] }}
                isActive={highlightedMetric === key}
                onClick={() => handleMetricCardClick(key)}
              />
            ))}
            <MetricCard
              metric={{name: "total", value: total}}
              isActive={highlightedMetric === null}
              onClick={() => handleMetricCardClick('total')}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
