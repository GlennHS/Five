const applyDecayToMetric = (m: number, decay: number, days: number): number => m * Math.pow(decay, days)

export default applyDecayToMetric
