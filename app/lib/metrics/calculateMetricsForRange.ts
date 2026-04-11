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
  to: Dayjs,
  manipulateMetrics: boolean = true,
): FiveMetric => {
  if (actions.length === 0) return {
    body: 0,
    mind: 0,
    cash: 0,
    work: 0,
    bond: 0,
  }

  const actionMap = buildActionMap(defs)

  const filtered = filterActionsByRange(actions, from, to)

  const deltas = filtered.map(a =>
    actionToMetrics(a, actionMap)
  )

  const summedMetrics = sumMetrics(deltas)

  console.log(JSON.stringify(summedMetrics))

  if (!manipulateMetrics) return summedMetrics

  METRIC_KEYS.forEach(key => summedMetrics[key] = getBoundedMetric(summedMetrics[key]))

  return summedMetrics
}