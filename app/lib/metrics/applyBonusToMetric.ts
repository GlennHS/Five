import dayjs from "dayjs"
import { Settings } from "../settings"
import { getToday } from "../dateTime"

export function applyBonusToMetric(value: number): number {
  const firstLaunch = dayjs(parseFloat(Settings.get('firstLaunch'))).valueOf()
  const bonus = Math.max(30 - Math.floor(getToday().subtract(firstLaunch).valueOf() / (1000 * 60 * 60 * 24)), 0)

  return value + bonus
}