import { MetricKey } from "@/app/types"
import { Star } from "lucide-react"
import { useInViewAnimation } from "@/app/components/useInViewAnimation";
import { METRIC_COLORS } from "@/app/constants/Colors"


export default function WeeklySummary({
  weeklyChange,
  metric
}: {
  weeklyChange: number,
  metric: MetricKey
}) {
  const { ref, isVisible } = useInViewAnimation<HTMLDivElement>();
  const isPositive = weeklyChange >= 0

  return (
    <div
      ref={ref}
      className={`bg-white border rounded-2xl p-4 flex items-center gap-3 transition-all duration-700 delay-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* Icon */}
      <div className={`text-${metric} text-xl`}>
        <Star fill={`rgb(${METRIC_COLORS[metric]})`}/>
      </div>

      {/* Text */}
      <p className="text-sm text-gray-700">
        {isPositive ? "Great work, t" : 'T'}his week your metric changed by{" "}
        <span
          className={`font-semibold ${
            isPositive ? `text-${metric}` : "text-gray-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {weeklyChange}
        </span>
        !
      </p>
    </div>
  )
}