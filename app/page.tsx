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

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full sm:max-w-3xl flex-col items-center justify-between p-4 bg-white sm:items-start">
        <div className="w-full">
          {/* <FiveRadarGraph data={metrics.map(m=>m.value)} /> */}
          {/* <FiveLineGraph data={createRandomFive()} /> */}
          <FiveBarGraph data={createRandomFive()} />
        </div>
        <div className='w-full flex items-center content-between'>
            {metrics.map((metric) => (
              <div key={metric.name} className="w-full h-full bg-white flex flex-col items-center">
                <h3 className={`text-sm font-medium text-${metric.name.toLowerCase()}`}>{metric.name}</h3>
                <p className="text-sm text-gray-500 uppercase">{metric.value}</p>
              </div>
            ))}
            <div className="w-full h-full bg-white flex flex-col items-center text-slate-600">
              <h3 className={"text-sm font-medium text-total"}>TOTAL</h3>
              <p className="text-sm text-gray-500 uppercase">{total}</p>
            </div>
        </div>
        <div>
          { /* Actions */ }
        </div>
      </main>
    </div>
  );
}
