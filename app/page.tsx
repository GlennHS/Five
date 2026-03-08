'use client'

// Types
import type { Metric } from './types';

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

// Fixtures
import APP_DATA from './fixtures/AppData';

// Helpers
import { calculateTotal } from './utils/helpers';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function Home() {

  const metrics = APP_DATA.metrics;
  const total = calculateTotal(metrics.map(m => m.value))

  return (
    <div className="flex min-h-screen items-stretch justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full sm:max-w-3xl flex-col gap-6 p-4 bg-white">
        <section className="flex-1 w-full rounded-2xl bg-slate-50 p-4 max-h-2/3">
          <FiveBarGraph />
        </section>
        <section className="w-full">
          <div className="grid grid-cols-3 grid-rows-2 gap-4">
            {metrics.map((m: Metric) => {
              return <MetricCard key={m.name} metric={m} />
            })}
            <MetricCard metric={{name: "TOTAL", value: total}} />
          </div>
        </section>
      </main>
    </div>
  );
}
