import { Dayjs } from "dayjs"
import { Action, ActionDefinition, MetricKey } from "@/app/types"
import { calculateMetricsForRange } from "./calculateMetricsForRange"

const getMetricScore = (
  actionHistory: Action[],
  actionDefinitions: ActionDefinition[],
  metricKey: MetricKey,
  from: Dayjs,
  to: Dayjs
): number => {
  return calculateMetricsForRange(
    actionHistory,
    actionDefinitions,
    from,
    to
  )[metricKey]
}

export default getMetricScore
