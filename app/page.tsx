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
import { Radar } from 'react-chartjs-2';

import APP_DATA from './fixtures/AppData';
import { RADAR_DEFAULT_CONFIG } from './fixtures/DefaultChartConfig';
import { useEffect, useState } from 'react';

import type { ChartConfiguration } from 'chart.js'
import { createRandomFive } from './utils/factories';

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
  console.log(metrics);

  const [chartData, setChartData] = useState<ChartConfiguration<'radar'>>(RADAR_DEFAULT_CONFIG);

  useEffect(() => {

    setChartData({
      ...RADAR_DEFAULT_CONFIG,
      data: {
        labels: [
          'MIND',
          'BODY',
          'CASH',
          'WORK',
          'BOND',
          'TOTAL',
        ],
        datasets:[{
          label: 'Metrics',
          data: createRandomFive(),
          fill: true,
          backgroundColor: "rgb(59 130 246 / 0.2)",
          borderColor: "rgb(59 130 246)",
          pointBackgroundColor: "rgb(59 130 246)",
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: "rgb(59 130 246)",
        }]
      }
    });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full sm:max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start">
        <div className="w-full">
          <Radar data={chartData.data} />
        </div>
        <div className='w-full flex items-center content-between'>
            {metrics.map((metric) => (
              <div key={metric.name} className="w-full h-full bg-white flex flex-col items-center">
                <h3 className={`text-sm font-medium text-${metric.name.toLowerCase()}`}>{metric.name}</h3>
                <p className="text-sm text-gray-500">{metric.value}</p>
              </div>
            ))}
        </div>
        <div>
          { /* Actions */ }
        </div>
      </main>
    </div>
  );
}
