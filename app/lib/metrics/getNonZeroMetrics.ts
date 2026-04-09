import { ActionDefinition, METRIC_KEYS } from "@/app/types"

const getNonZeroMetrics = (def: ActionDefinition) => {
  return METRIC_KEYS
    .filter(k => def[k] !== 0)
    .map(k => ({
      key: k,
      value: def[k]
    }))
}

export default getNonZeroMetrics
