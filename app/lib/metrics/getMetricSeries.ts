import { Dayjs } from "dayjs"
import { Action, ActionDefinition, MetricKey } from "@/app/types"
import { calculateMetricsForRange } from "./calculateMetricsForRange"
import { getToday } from "../dateTime"

/**
 * Returns 7 cumulative values for a given metric over a rolling week.
 * Final point = total for the full 7-day window.
 */
const getWeeklyMetricSeries = (
  actions: Action[],
  defs: ActionDefinition[],
  metricKey: MetricKey,
  date: Dayjs = getToday()
): number[] => {
  const values: number[] = []

  const start = date.subtract(6, "day")

  for (let i = 0; i < 7; i++) {
    const dayEnd = start.add(i, "day")

    const metrics = calculateMetricsForRange(
      actions,
      defs,
      start,
      dayEnd,
    )

    values.push(metrics[metricKey])
  }

  return values
}

export default getWeeklyMetricSeries