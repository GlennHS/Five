import { Action, ActionDefinition, FiveMetric } from "@/app/types"
import { convertTimestampToDayJS, getDaysSinceDate } from "../dateTime"
import applyDecayToMetric from "../metrics/applyDecayToMetric"

const actionToMetrics = (
  action: Action,
  actionMap: Record<string, ActionDefinition>,
  decay?: number,
): Partial<FiveMetric> => {

  const def = actionMap[action.actionId]
  if (!def) return {}

  return {
    mind: def.mind ? applyDecayToMetric(def.mind, decay ?? 1, getDaysSinceDate(convertTimestampToDayJS(action.timestamp))) : 0,
    body: def.body ? applyDecayToMetric(def.body, decay ?? 1, getDaysSinceDate(convertTimestampToDayJS(action.timestamp))) : 0,
    work: def.work ? applyDecayToMetric(def.work, decay ?? 1, getDaysSinceDate(convertTimestampToDayJS(action.timestamp))) : 0,
    cash: def.cash ? applyDecayToMetric(def.cash, decay ?? 1, getDaysSinceDate(convertTimestampToDayJS(action.timestamp))) : 0,
    bond: def.bond ? applyDecayToMetric(def.bond, decay ?? 1, getDaysSinceDate(convertTimestampToDayJS(action.timestamp))) : 0,
  }
}

export default actionToMetrics
