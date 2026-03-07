'use client'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

import APP_DATA from './fixtures/AppData';
import { RADAR_DEFAULT_CONFIG } from './fixtures/DefaultChartConfig';
import { useState } from 'react';

import type { ChartConfiguration } from 'chart.js'
import { createRandomFive } from './utils/factories';
import { calculateTotal } from './utils/helpers';
import FiveLineGraph from './components/graphs/FiveLineGraph';
import FiveRadarGraph from './components/graphs/FiveRadarGraph';
import FiveBarGraph from './components/graphs/FiveBarGraph';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function Home() {

  const metrics = Object.values(APP_DATA.metrics);
  const total = calculateTotal(metrics.map(m => m.value))

  const metricCards = [
    ...metrics.map((metric) => ({
      name: metric.name,
      value: metric.value,
    })),
    { name: 'TOTAL', value: total },
  ];

  const metricBgClasses: Record<string, string> = {
    MIND: 'bg-mind',
    BODY: 'bg-body',
    CASH: 'bg-cash',
    WORK: 'bg-work',
    BOND: 'bg-bond',
    TOTAL: 'bg-slate-900',
  };

  return (
    <div className="flex min-h-screen items-stretch justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full sm:max-w-3xl flex-col gap-6 p-4 bg-white">
        <section className="flex-1 w-full rounded-2xl bg-slate-50 p-4 max-h-2/3">
          {/* <FiveRadarGraph data={metrics.map(m=>m.value)} /> */}
          {/* <FiveLineGraph data={createRandomFive()} /> */}
          <FiveBarGraph />
        </section>

        <section className="w-full">
          <div className="grid grid-cols-3 grid-rows-2 gap-4">
            {metricCards.map((metric) => {
              const bgClass = metricBgClasses[metric.name] ?? 'bg-slate-200';

              return (
                <div
                  key={metric.name}
                  className={`rounded-2xl p-4 shadow-sm text-white flex flex-col justify-between ${bgClass}`}
                >
                  <h3 className="text-lg font-semibold tracking-wide">
                    {metric.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium opacity-90 uppercase">
                    {metric.value}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
