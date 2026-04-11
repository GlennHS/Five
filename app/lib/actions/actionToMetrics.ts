import { Action, ActionDefinition, FiveMetric } from "@/app/types"
import { convertTimestampToDayJS, getDaysSinceDate } from "../dateTime"
import applyDecayToMetric from "../metrics/applyDecayToMetric"

const actionToMetrics = (
  action: Action,
  actionMap: Record<string, ActionDefinition>,
): Partial<FiveMetric> => {

  const def = actionMap[action.actionId]
  if (!def) return {}

  /* If you want to reintroduce decay, here it is */
  // return {
  //   mind: def.mind ? applyDecayToMetric(def.mind, getDaysSinceDate(convertTimestampToDayJS(action.timestamp))) : 0,
  //   body: def.body ? applyDecayToMetric(def.body, getDaysSinceDate(convertTimestampToDayJS(action.timestamp))) : 0,
  //   work: def.work ? applyDecayToMetric(def.work, getDaysSinceDate(convertTimestampToDayJS(action.timestamp))) : 0,
  //   cash: def.cash ? applyDecayToMetric(def.cash, getDaysSinceDate(convertTimestampToDayJS(action.timestamp))) : 0,
  //   bond: def.bond ? applyDecayToMetric(def.bond, getDaysSinceDate(convertTimestampToDayJS(action.timestamp))) : 0,
  // }

  return {
    mind: def.mind ? def.mind : 0,
    body: def.body ? def.body : 0,
    work: def.work ? def.work : 0,
    cash: def.cash ? def.cash : 0,
    bond: def.bond ? def.bond : 0,
  }
}

export default actionToMetrics
