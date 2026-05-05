import { MetricKey } from "@/app/types"
import { METRIC_INFO } from "@/app/constants/Constants"

export default function ReportSummary({
  focusedMetric,
  neglectedMetric,
  focusedChange,
  neglectedChange,
}: {
  focusedMetric: MetricKey
  neglectedMetric: MetricKey
  focusedChange: number
  neglectedChange: number
}) {
  return (
    <div className="bg-white border rounded-2xl p-4 text-sm text-gray-700 leading-relaxed">
      This week you focused on{" "}
      <span className={`font-bold text-${focusedMetric}`}>
        {METRIC_INFO[focusedMetric].title}
      </span>{" "}
      <span className="text-gray-400">(+{focusedChange})</span> but neglected{" "}
      <span className={`font-bold text-${neglectedMetric}`}>
        {METRIC_INFO[neglectedMetric].title}
      </span>{" "}
      <span className="text-gray-400">({neglectedChange})</span>.
    </div>
  )
}