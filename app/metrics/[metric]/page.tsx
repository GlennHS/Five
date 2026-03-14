import type { MetricKey } from '@/app/types'
import { use } from 'react'
import MetricPage from './MetricPage'

const VALID_METRIC_SLUGS = ['mind', 'body', 'cash', 'work', 'bond'] as const

export function generateStaticParams() {
  return VALID_METRIC_SLUGS.map(metric => ({ metric }))
}

export default function Page({
  params,
}: {
  params: Promise<{ metric: MetricKey }>
}) {
  const { metric } = use(params)
  return <MetricPage metric={metric}/>
}