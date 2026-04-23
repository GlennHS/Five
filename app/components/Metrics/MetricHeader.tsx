"use client"

import getMetricDisplayInfo from "@/app/lib/metrics/getMetricDisplayInfo"
import { MetricKey } from "@/app/types"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MetricHeader({
  metric
}: {
  metric: MetricKey
}) {
  const router = useRouter()
  const metricInfo = getMetricDisplayInfo(metric)

  return (
    <div className="space-y-3">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft strokeWidth={2} size={16}/> Back to previous page
      </button>

      {/* Title row */}
      <div className="flex items-center gap-6 justify-between">
        <div>
          <h1 className={`text-4xl font-bold text-${metric} tracking-tight`}>
            {metricInfo.title}
          </h1>

          {metricInfo.subtitle && (
            <p className="text-gray-700 text-xs mt-4">{metricInfo.subtitle}</p>
          )}
        </div>

        <div className={`text-${metric}`}>
          <metricInfo.icon size={42} strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}