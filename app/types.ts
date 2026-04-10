import { TAG_COLOR_CLASSES } from "./constants/Colors"

export const METRIC_KEYS = ["mind", "body", "work", "cash", "bond"] as const
export const METRIC_LETTERS = {
  mind: "M",
  body: "B",
  work: "W",
  cash: "C",
  bond: "R"
} as const

export const TIME_GROUPS = ["week", "month", "6 months"] as const
export type TimeGroup = "day" | "week" | "month"
export type MetricKey = typeof METRIC_KEYS[number]
export type FiveMetric = Record<MetricKey, number>
export type MetricName = Uppercase<MetricKey>

export type Metric = {
  name: MetricKey | "total"
  value: number
}

export type Action = {
  id: number
  timestamp: number
  actionId: number
  note?: string
}

export type ActionDefinition = {
  id: number
  name: string,
  tags: Tag[],
  archived: boolean
} & Partial<FiveMetric>

export type Tag = {
  id: number,
  name: string,
  colorKey: keyof typeof TAG_COLOR_CLASSES,
}

/* #region DB Types */
export interface TagDB {
  id: number
  name: string
  colorKey: keyof typeof TAG_COLOR_CLASSES,
}

export interface ActionDefinitionDB {
  id: number
  name: string
  tagIds: number[]
  mind: number
  body: number
  work: number
  cash: number
  bond: number
  archived: boolean
}

export type ActionDB = {
  id: number
  timestamp: number
  actionId: number
  note?: string
}
/* #endregion */
