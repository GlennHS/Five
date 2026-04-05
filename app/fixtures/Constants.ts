export const DECAY_CUTOFF = 7 // Days until metric fully decays
export const METRIC_HARD_CAP = 100 // Adjusted metrics greater than this will be capped at this
export const METRIC_SOFT_CAP = 80 // Raw metrics greater than this will be adjusted downwards
export const METRIC_SOFT_FLOOR = 30 // Raw metrics less than this will be adjusted upwards
export const METRIC_HARD_FLOOR = 0 // Adjusted metrics less than this will be capped at this
export const METRIC_DAMPENING_FACTOR = 0.88 // Metrics above/below soft caps will be adjusted by this factor