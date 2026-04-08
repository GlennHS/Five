import { DECAY_CUTOFF } from "@/app/fixtures/Constants"

const applyDecayToMetric = (m: number, days: number): number => {
  if (days === 0) return m
  else if (days > DECAY_CUTOFF) return 0
  
  const factor = 1 - (days / DECAY_CUTOFF)
  return m * factor
}

export default applyDecayToMetric
