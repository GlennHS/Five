import { Dayjs } from "dayjs"
import { Action, ActionDefinition, MetricKey, TimeGroup } from "@/app/types"
import { calculateMetricsForRange } from "./calculateMetricsForRange"

/**
 * @description Used to get values for FiveLineGraph
 * @param actionHistory action history from app data
 * @param actionDefinitions action definitions from app data
 * @param metricKey the metric to be queried
 * @param from date from
 * @param to date to
 * @param groupBy time period to group by
 * @returns Array of numbers where each number represents the sum of the metric change for that time period group
 * @
 */
const getMetricSeries = (
  actionHistory: Action[],
  actionDefinitions: ActionDefinition[],
  metricKey: MetricKey,
  from: Dayjs,
  to: Dayjs,
  groupBy: TimeGroup
): number[] => {

  const values: number[] = []

  const actions = actionHistory
  const defs = actionDefinitions

  let accumulator = 0

  let cursor = from.startOf(groupBy)

  while (cursor.isBefore(to) || cursor.isSame(to)) {

    const bucketStart = cursor
    const bucketEnd = cursor.endOf(groupBy)

    const metrics = calculateMetricsForRange(
      actions,
      defs,
      bucketStart,
      bucketEnd
    )

    accumulator += metrics[metricKey]

    values.push(accumulator)

    cursor = cursor.add(1, groupBy)
  }

  return values
}

export default getMetricSeries
