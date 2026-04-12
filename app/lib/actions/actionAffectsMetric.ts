import { Action, ActionDefinition, MetricKey } from "@/app/types"

const actionAffectsMetric = (
  def: ActionDefinition,
  metric: MetricKey
): boolean => {
  return (def[metric] ?? 0) !== 0
}

export default actionAffectsMetric