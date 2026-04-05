import { METRIC_DAMPENING_FACTOR, METRIC_HARD_CAP, METRIC_HARD_FLOOR, METRIC_SOFT_CAP, METRIC_SOFT_FLOOR } from "@/app/fixtures/Constants"

const getBoundedMetric = (m: number): number => {
  let adjustedValue = m
  if (m > METRIC_SOFT_CAP)
    adjustedValue = METRIC_SOFT_CAP + Math.pow(m - METRIC_SOFT_CAP, METRIC_DAMPENING_FACTOR)
  else if (m < METRIC_SOFT_FLOOR)
    adjustedValue = METRIC_SOFT_FLOOR - Math.pow(METRIC_SOFT_FLOOR - m, METRIC_DAMPENING_FACTOR)

  if (adjustedValue > METRIC_HARD_CAP) return METRIC_HARD_CAP
  else if (adjustedValue < METRIC_HARD_FLOOR) return METRIC_HARD_FLOOR
  else return Math.round(adjustedValue)
}

export default getBoundedMetric
