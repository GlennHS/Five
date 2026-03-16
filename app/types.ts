import { TAG_COLOR_CLASSES } from "./fixtures/Colors"

export const METRIC_KEYS = ["mind", "body", "work", "cash", "bond"] as const
export const METRIC_LETTERS = {
  mind: "M",
  body: "B",
  work: "W",
  cash: "C",
  bond: "R"
} as const
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

export type ActionDefinition = {
  id: string
  name: string,
  tags?: Tag[]
} & Partial<FiveMetric>

export type ActionDetails = {
  id: string
  name: string
  tags: Tag[]
  timestamp: number
  note?: string
  metrics: FiveMetric
}

export type MetricSnapshot = {
  timestamp: number
} & FiveMetric

export type MetricSnapshotHistory = {
  day: MetricSnapshot
  week: MetricSnapshot
  month: MetricSnapshot
  year: MetricSnapshot
}

export type Tag = {
  id: string,
  name: string,
  colorClass: keyof typeof TAG_COLOR_CLASSES,
}
