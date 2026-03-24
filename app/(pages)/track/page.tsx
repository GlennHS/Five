'use client';

import { calculateMetricsForRange, calculateTotal } from "../../utils/helpers";
import { METRIC_KEYS } from "../../types";
import MetricCardLarge from "../../components/MetricCardLarge";
import { actionDefinitions, actionHistory } from "../../fixtures/AppData";
import { getAWeekAgo, getToday } from "../../utils/dateTime";
import BackLink from "../../components/BackLink";

export default function Page() {

  const metrics = calculateMetricsForRange(actionHistory, actionDefinitions, getAWeekAgo(), getToday());
  const total = calculateTotal(actionHistory, actionDefinitions, getAWeekAgo(), getToday());

  return (
    <main className="min-h-screen w-full bg-white px-4 py-8">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <BackLink />

        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Track your actions
          </h1>
          <p className="text-sm text-slate-600">
            See your latest actions and log what you&apos;ve done
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
            What are actions?
          </h2>
          <p>
            Actions are the building blocks of your metrics. Each action represents something you did, like working out, studying, or spending time with friends. When you log an action, it contributes points to one or more life metrics; Mind, Body, Work, Cash, or Bond. Over time these actions build up to show patterns in how you spend your time and energy.
          </p>
        </section>
      </section>
    </main>
  )
}