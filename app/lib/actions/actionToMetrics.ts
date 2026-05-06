import { Action, ActionDefinition, FiveMetric } from "@/app/types"

const actionToMetrics = (
  action: Action,
  actionMap: Record<string, ActionDefinition>,
): Partial<FiveMetric> => {

  const def = actionMap[action.actionId]
  if (!def) return {}

  return {
    mind: def.mind ? def.mind : 0,
    body: def.body ? def.body : 0,
    work: def.work ? def.work : 0,
    cash: def.cash ? def.cash : 0,
    bond: def.bond ? def.bond : 0,
  }
}

export default actionToMetrics
