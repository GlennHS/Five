import { Action, ActionDefinition, MetricKey } from "@/app/types"

const actionAffectsMetric = (
  action: Action,
  defs: ActionDefinition[],
  metric: MetricKey
): boolean => {

  const def = defs.find(d => d.id === action.actionId)
  if (!def) return false

  return (def[metric] ?? 0) !== 0
}

export default actionAffectsMetric