import { FiveMetric, METRIC_KEYS } from "@/app/types"

const getNonZeroMetrics = (metrics: FiveMetric) => {
  return METRIC_KEYS
    .filter(k => metrics[k] !== 0)
    .map(k => ({
      key: k,
      value: metrics[k]
    }))
}

export default getNonZeroMetrics
