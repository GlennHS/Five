import { Dayjs } from "dayjs"
import { Action, ActionDefinition, MetricKey } from "@/app/types"
import { calculateMetricsForRange } from "./calculateMetricsForRange"
import { getAWeekAgo, getToday } from "../dateTime"

const getMetricScore = (
  actionHistory: Action[],
  actionDefinitions: ActionDefinition[],
  metricKey: MetricKey,
  from: Dayjs = getAWeekAgo(),
  to: Dayjs = getToday(),
): number => {
  return calculateMetricsForRange(
    actionHistory,
    actionDefinitions,
    from,
    to
  )[metricKey]
}

export default getMetricScore
