'use client';

import { calculateMetricsForRange, calculateTotal } from "../utils/helpers";
import { METRIC_KEYS } from "../types";
import MetricCardLarge from "../components/MetricCardLarge";
import { actionDefinitions, actionHistory } from "../fixtures/AppData";
import { getAWeekAgo, getToday } from "../utils/dateTime";
import BackLink from "../components/BackLink";

export default function Page() {

  const metrics = calculateMetricsForRange(actionHistory, actionDefinitions, getAWeekAgo(), getToday());
  const total = calculateTotal(metrics);

  return (
    <main className="min-h-screen w-full bg-white px-4 py-8">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <BackLink />
        
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Your metrics overview
          </h1>
          <p className="text-sm text-slate-600">
            Tap a card to explore that area in more detail
          </p>
        </header>

        <section className="grid grid-cols-2 gap-4">
          {METRIC_KEYS.map(k => (
            <MetricCardLarge key={k} metric={{name: k, value: metrics[k]}} />
          ))}
          <MetricCardLarge
            metric={{ name: "total", value: total }}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <h2 className="mb-1 text-base font-semibold text-slate-900">
            How to use these metrics
          </h2>
          <p>
            Each metric represents one dimension of your wellbeing. Use the
            overview to spot which areas are strong and which might need more
            attention. Dive into an individual metric page for ideas and actions
            to move the needle over time.
          </p>
        </section>
      </section>
    </main>
  )
}