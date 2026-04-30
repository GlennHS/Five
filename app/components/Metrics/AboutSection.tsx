import { MetricKey } from "@/app/types"
import { useInViewAnimation } from "@/app/components/useInViewAnimation";
import { METRIC_INFO } from "@/app/constants/Constants";

// components/metrics/AboutSection.tsx
export default function AboutSection({
  metric: metric,
}: {
  metric: MetricKey
}) {
  const metricInfo = METRIC_INFO[metric]

  const { ref, isVisible } = useInViewAnimation<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`bg-white border rounded-2xl p-4 flex gap-4 items-start transition-all duration-700 delay-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* Icon */}
      <div className={`text-${metric} mt-1`}>
        <metricInfo.icon />
      </div>

      {/* Content */}
      <div>
        <h2 className="font-semibold text-sm text-gray-900">
          About {metricInfo.title}
        </h2>

        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
          {metricInfo.description}
        </p>
      </div>
    </div>
  )
}