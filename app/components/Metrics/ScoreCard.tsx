import { MetricKey } from "@/app/types"

export default function ScoreCard({
  score,
  dailyChange,
  metric,
}: {
  score: number
  dailyChange: number
  metric: MetricKey
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4 grid grid-cols-2 gap-4">
      <div className="text-center">
        <p className="text-sm text-gray-500">Current score</p>
        <p className={`text-4xl font-bold text-${metric}`}>{score}</p>
        <p className="text-xs text-gray-400">out of 100</p>
      </div>

      <div className="text-center border-l">
        <p className="text-sm text-gray-500">Daily change</p>
        <p className={`text-2xl font-semibold text-${metric}`}>
          +{dailyChange}
        </p>
        <p className="text-xs text-gray-400">vs yesterday</p>
      </div>
    </div>
  )
}