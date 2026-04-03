import { FiveMetric, METRIC_KEYS } from "@/app/types"

const sumMetrics = (
  deltas: Partial<FiveMetric>[]
): FiveMetric => {

  const r: FiveMetric = { mind: 0, body: 0, work: 0, cash: 0, bond: 0 }

  deltas.forEach(d => {
    METRIC_KEYS.forEach(k => {
      r[k] += d[k] ?? 0
    })
  })

  METRIC_KEYS.forEach(k => r[k] = Math.floor(r[k]))

  return r
}

export default sumMetrics