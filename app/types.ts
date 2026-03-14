export const METRIC_KEYS = ["mind", "body", "work", "cash", "bond"] as const
export type TimeGroup = "day" | "week" | "month"
export type MetricKey = typeof METRIC_KEYS[number]
export type FiveMetric = Record<MetricKey, number>
export type MetricName = Uppercase<MetricKey>

export type Metric = {
  name: MetricKey | "total"
  value: number
}

export type Action = {
  id: string
  timestamp: number
  actionId: string
  note?: string
}

export type FiveMetrics = {
  mind: number
  body: number
  work: number
  cash: number
  bond: number
}

export type ActionDefinition = {
  id: string
  name: string
  tags?: string[]
} & Partial<FiveMetrics>

export type MetricSnapshot = {
  timestamp: number
} & FiveMetrics

export type MetricSnapshotHistory = {
  day: MetricSnapshot
  week: MetricSnapshot
  month: MetricSnapshot
  year: MetricSnapshot
}
