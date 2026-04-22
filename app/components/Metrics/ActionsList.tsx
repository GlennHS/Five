import { MetricKey } from "@/app/types"
import ActionCard from "@/app/components/ActionCards/ActionCard"

export default function ActionsList({
  actions,
  metric,
}: {
  actions: any[],
  metric: MetricKey,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4">
      <div className="flex justify-between mb-4">
        <p className="font-semibold">Recent Actions</p>
        <button className={`text-${metric} text-sm`}>View all</button>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-3">
        {actions.map((action, i) => (
          <ActionCard action={action} key={i} metricTheme={metric} />
        ))}
      </div>

      <div className="text-center text-sm text-gray-400 mt-3">
        Scroll to see more...
      </div>
    </div>
  )
}