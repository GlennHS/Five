import { Dayjs } from "dayjs"
import { TAG_COLOR_CLASSES } from "./constants/Colors"

export const METRIC_KEYS = ["mind", "body", "cash", "work", "bond"] as const
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

export interface DailyMetric {
  metric: MetricKey,
  value: number,
  date: Dayjs
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

export interface SettingsConfig {
  version: string | undefined
  firstLaunch: string | undefined
  decayRate: string | undefined
  preferedChart: string | undefined
  wantsTutorial: string | undefined
}

export enum SettingsSetupResult { TUTORIAL, UPGRADE, NONE }

export type TutorialState = "not-started" | "action-logged" | "finished" | "skipped"

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

export interface ChangelogEntry {
  date: string
  version: string
  changes: { type: string, notes: string }[]
}
