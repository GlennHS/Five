import dayjs, { Dayjs } from "dayjs"
import { Action, ActionDefinition, FiveMetric, METRIC_KEYS } from "@/app/types"
import sumMetrics from "./sumMetrics"
import filterActionsByRange from "../actions/filterActionsByRange"
import actionToMetrics from "../actions/actionToMetrics"
import getBoundedMetric from "./getBoundedMetric"
import { Settings } from "../settings"
import buildActionMap from "../actions/buildActionMap"

export const calculateMetricsForRange = (
  actions: Action[],
  defs: ActionDefinition[],
  from: Dayjs,
  to: Dayjs,
  addNewStarterBonus: boolean = true,
  addDecay: boolean = false,
  ignoreCaps: boolean = false,
): FiveMetric => {
  const actionMap = buildActionMap(defs)
  let summedMetrics: FiveMetric = {
    body: 0,
    mind: 0,
    cash: 0,
    work: 0,
    bond: 0,
  }
  if (actions.length > 0) {
  
    const filtered = filterActionsByRange(actions, from, to)
  
    const deltas = filtered.map(a =>
      actionToMetrics(a, actionMap)
    )
  
    summedMetrics = sumMetrics(deltas)
  }

  if (addNewStarterBonus) {
    // add the new starter bonus (if applicable)
    const bonus = addNewStarterBonus ? Math.max(30 - Math.floor(dayjs().subtract(dayjs(parseFloat(Settings.get('firstLaunch'))).valueOf()).valueOf() / (1000 * 60 * 60 * 24)), 0) : 0
    METRIC_KEYS.forEach(key => summedMetrics[key] += bonus)
  }

  if (addDecay) {
    const daysOfDecay = Math.abs(Math.floor(from.diff(to, 'days')))
    const decayConfig = Settings.get("decayRate")
    if (decayConfig !== "") {
      const decayJSON = JSON.parse(decayConfig)
      METRIC_KEYS.forEach(key => summedMetrics[key] -= decayJSON[key] * daysOfDecay)
    }
  }

  // cap it between hard caps
  if (!ignoreCaps) {
    METRIC_KEYS.forEach(key => summedMetrics[key] = getBoundedMetric(summedMetrics[key]))
  }

  return summedMetrics
}
