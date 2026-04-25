import { MetricKey } from "@/app/types"
import { useInViewAnimation } from "@/app/components/useInViewAnimation";

export default function ScoreCard({
  score,
  dailyChange,
  metric,
}: {
  score: number
  dailyChange: number
  metric: MetricKey
}) {
  const { ref, isVisible } = useInViewAnimation<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl shadow-sm border p-4 grid grid-cols-2 gap-4 transition-all duration-700 delay-200 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
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