export type MetricName = "MIND" | "BODY" | "CASH" | "WORK" | "BOND"

export type Metric = {
  name: MetricName | "TOTAL"
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
