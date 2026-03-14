import type { MetricKey } from '@/app/types'
import Link from 'next/link'
import { getMetricScore, getMetricSeries } from '@/app/utils/helpers'
import FiveLineGraph from '@/app/components/graphs/FiveLineGraph'
import { getAWeekAgo, getToday } from '@/app/utils/dateTime'
import dayjs from 'dayjs'
import { actionDefinitions, actionHistory } from '@/app/fixtures/AppData'

const VALID_METRIC_SLUGS = ['mind', 'body', 'cash', 'work', 'bond'] as const

export function generateStaticParams() {
  return VALID_METRIC_SLUGS.map(metric => ({ metric }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ metric: MetricKey }>
}) {


  const metricName = await params.then(p => p.metric)

  return (
    <main className="min-h-screen w-full bg-white px-4 py-6">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <Link
            href="/metrics"
            className="text-sm font-medium text-slate-500 underline underline-offset-2 hover:text-slate-700"
          >
            ← Back to metrics
          </Link>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 uppercase">
            {metricName}
          </h1>

          <p className="text-sm text-slate-600">
            Current score:
            <span className="font-semibold text-slate-900">
              {getMetricScore(actionHistory, actionDefinitions, metricName, getAWeekAgo(), getToday())}
            </span>
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Trend (this week)
          </h2>

          <div className="h-64 w-full">
            <FiveLineGraph data={getMetricSeries(actionHistory, actionDefinitions, metricName, getAWeekAgo(), dayjs(), 'day')} />
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-slate-700">
            Actions
          </h2>

          <div
            className="min-h-50 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center text-slate-500"
            aria-label="Action cards container"
          >
            Action cards will go here.
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <h2 className="mb-1 text-base font-semibold text-slate-900">
            About {metricName}
          </h2>

          <p>
            Track and improve this area with small, consistent actions. Use the
            graph above to spot patterns and the action cards to choose what to
            do next.
          </p>
        </section>
      </section>
    </main>
  )
}