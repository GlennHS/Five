export const METRIC_COLORS = {
  mind: "59, 130, 246",
  body: "249, 115, 22",
  cash: "34, 197, 94",
  work: "168, 85, 247",
  bond: "236, 72, 153"
}

export const NEUTRAL_COLOR = "113, 113, 153"

export const TAG_COLOR_CLASSES = {
  green: "bg-green-300/10 text-green-700 border-green-700",
  red: "bg-red-300/10 text-red-500 border-red-500",
  yellow: "bg-yellow-200/10 text-yellow-600 border-yellow-500",
  blue: "bg-blue-300/10 text-blue-500 border-blue-500",
} as const

export type TagColorKey = keyof typeof TAG_COLOR_CLASSES