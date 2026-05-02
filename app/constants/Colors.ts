export const METRIC_COLORS = {
  mind: "59, 130, 246",
  body: "249, 115, 22",
  cash: "34, 197, 94",
  work: "168, 85, 247",
  bond: "236, 72, 153"
}

export const TAG_COLOR_CLASSES = {
  red: "bg-red-300/20 text-red-500 border-red-500",
  orange: "bg-orange-300/20 text-orange-500 border-orange-500",
  yellow: "bg-yellow-200/20 text-yellow-600 border-yellow-500",
  green: "bg-green-300/20 text-green-700 border-green-700",
  blue: "bg-blue-300/20 text-blue-500 border-blue-500",
  purple: "bg-purple-300/20 text-purple-500 border-purple-500",
  pink: "bg-pink-300/20 text-pink-500 border-pink-500",
  white: "bg-gray-100/20 text-gray-500 border-white",
  gray: "bg-gray-500/20 text-gray-500 border-gray-500",
  black: "bg-gray-900/20 text-gray-100 border-gray-900",
} as const

export type TagColorKey = keyof typeof TAG_COLOR_CLASSES