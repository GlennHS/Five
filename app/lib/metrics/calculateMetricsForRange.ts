import dayjs, { Dayjs } from "dayjs"
import { Action, ActionDefinition, FiveMetric, METRIC_KEYS } from "@/app/types"
import sumMetrics from "./sumMetrics"
import filterActionsByRange from "../actions/filterActionsByRange"
import actionToMetrics from "../actions/actionToMetrics"
import buildActionMap from "../actions/buildActionMap"
import getBoundedMetric from "./getBoundedMetric"
import Settings from "../settings"

export const calculateMetricsForRange = (
  actions: Action[],
  defs: ActionDefinition[],
  from: Dayjs,
  to: Dayjs,
  manipulateMetrics: boolean = true,
): FiveMetric => {
  let summedMetrics: FiveMetric = {
    body: 0,
    mind: 0,
    cash: 0,
    work: 0,
    bond: 0,
  }
  if (actions.length > 0) {
    const actionMap = buildActionMap(defs)
  
    const filtered = filterActionsByRange(actions, from, to)
  
    const deltas = filtered.map(a =>
      actionToMetrics(a, actionMap)
    )
  
    summedMetrics = sumMetrics(deltas)
  }

  if (!manipulateMetrics) return summedMetrics
  else {

    // add the new starter bonus (if applicable)
    const bonus = Math.max(30 - Math.floor(dayjs().subtract(dayjs(parseFloat(Settings.get('firstLaunch'))).valueOf()).valueOf() / (1000 * 60 * 60 * 24)), 0)
    METRIC_KEYS.forEach(key => summedMetrics[key] += bonus)

    // cap it between hard caps
    METRIC_KEYS.forEach(key => summedMetrics[key] = getBoundedMetric(summedMetrics[key]))
    return summedMetrics
  }

}