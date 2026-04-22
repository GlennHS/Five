import getMetricDisplayInfo from "@/app/lib/metrics/getMetricDisplayInfo"
import { MetricKey } from "@/app/types"

// components/metrics/AboutSection.tsx
export default function AboutSection({
  metric: metric,
}: {
  metric: MetricKey
}) {
  const metricInfo = getMetricDisplayInfo(metric)

  return (
    <div className="bg-white border rounded-2xl p-4 flex gap-4 items-start">
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
          {metricInfo.subtitle}
        </p>
      </div>
    </div>
  )
}