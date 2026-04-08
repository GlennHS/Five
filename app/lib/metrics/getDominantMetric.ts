import { MetricKey, METRIC_KEYS, ActionDefinition } from "@/app/types"

const getDominantMetric = (def: ActionDefinition): MetricKey | null => {

  let best: MetricKey = 'mind'
  let bestValue = 0

  METRIC_KEYS.forEach(k => {
    const value = Math.abs(def[k] ?? 0)

    if (value > bestValue) {
      best = k
      bestValue = value
    }
  })

  return best
}

export default getDominantMetric
