import { ActionDefinition, MetricKey } from "@/app/types"

const definitionAffectsMetric = (
  def: ActionDefinition,
  metric: MetricKey
): boolean => {
  return (def[metric] ?? 0) !== 0
}

export default definitionAffectsMetric