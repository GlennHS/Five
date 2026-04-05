import { DECAY_CUTOFF } from "@/app/fixtures/Constants"

const applyDecayToMetric = (m: number, decay: number, days: number): number => {
  if (days === 0) return m
  else if (days > DECAY_CUTOFF) return 0
  else return m * Math.pow(decay, days)
}

export default applyDecayToMetric
