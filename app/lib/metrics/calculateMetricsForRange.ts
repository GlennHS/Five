import { Dayjs } from "dayjs"
import { Action, ActionDefinition, FiveMetric } from "@/app/types"
import sumMetrics from "./sumMetrics"
import filterActionsByRange from "../actions/filterActionsByRange"
import actionToMetrics from "../actions/actionToMetrics"
import buildActionMap from "../actions/buildActionMap"

export const calculateMetricsForRange = (
  actions: Action[],
  defs: ActionDefinition[],
  from: Dayjs,
  to: Dayjs
): FiveMetric => {

  const actionMap = buildActionMap(defs)

  const filtered = filterActionsByRange(actions, from, to)

  const deltas = filtered.map(a =>
    actionToMetrics(a, actionMap, 0.9)
  )

  return sumMetrics(deltas)
}