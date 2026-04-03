import { FiveMetric, MetricKey, METRIC_KEYS } from "@/app/types"

const getDominantMetric = (metrics: FiveMetric): MetricKey | null => {

  let best: MetricKey | null = null
  let bestValue = 0

  METRIC_KEYS.forEach(k => {
    const value = Math.abs(metrics[k])

    if (value > bestValue) {
      best = k
      bestValue = value
    }
  })

  return best
}

export default getDominantMetric
