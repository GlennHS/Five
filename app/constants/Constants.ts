export const DECAY_CUTOFF = 7 // Days until metric fully decays
export const METRIC_HARD_CAP = 100 // Adjusted metrics greater than this will be capped at this
export const METRIC_SOFT_CAP = 80 // Raw metrics greater than this will be adjusted downwards
export const METRIC_SOFT_FLOOR = 30 // Raw metrics less than this will be adjusted upwards
export const METRIC_HARD_FLOOR = 0 // Adjusted metrics less than this will be capped at this
export const METRIC_DAMPENING_FACTOR = 0.88 // Metrics above/below soft caps will be adjusted by this factor

export const METRIC_INFO_TEXT = {
  mind: 'MIND is your mental health. This is your mind\'s health, letting your brain relax, switching off or challenging it to grow and stimulating it (positively).',
  body: 'BODY is your physical health. This is your heart health, your "7 minute mile", your "my knee shouldn\'t make that noise" metric.',
  cash: 'CASH is your financial health. This is how healthy your wallet is, boosted by things like saving and spending responsibly.',
  work: 'WORK is your academic/career health. This can be climbing the corporate ladder, personal projects, learning something new, studying, doing that essay you were meant to do.',
  bond: 'BOND is your social health. This can be caring for your friends, making time for your family or showing your partner you care; nurturing relationships boosts this metric.',
} as const

export const VERSION_NUMBER = "0.1.0alpha1a"