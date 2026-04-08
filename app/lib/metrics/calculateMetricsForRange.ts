import { Dayjs } from "dayjs"
import { Action, ActionDefinition, FiveMetric, METRIC_KEYS } from "@/app/types"
import sumMetrics from "./sumMetrics"
import filterActionsByRange from "../actions/filterActionsByRange"
import actionToMetrics from "../actions/actionToMetrics"
import buildActionMap from "../actions/buildActionMap"
import getBoundedMetric from "./getBoundedMetric"

export const calculateMetricsForRange = (
  actions: Action[],
  defs: ActionDefinition[],
  from: Dayjs,
  to: Dayjs
): FiveMetric => {

  const actionMap = buildActionMap(defs)

  const filtered = filterActionsByRange(actions, from, to)

  const deltas = filtered.map(a =>
    actionToMetrics(a, actionMap)
  )

  const summedMetrics = sumMetrics(deltas)

  METRIC_KEYS.forEach(key => summedMetrics[key] = getBoundedMetric(summedMetrics[key]))

  return summedMetrics
}