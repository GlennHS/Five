import { useRouter } from "next/navigation"
import { Action, MetricKey } from "@/app/types"
import ActionCard from "@/app/components/ActionCards/ActionCard"
import { useInViewAnimation } from "@/app/components/useInViewAnimation";

export default function ActionsList({
  actions,
  metric,
}: {
  actions: Action[],
  metric: MetricKey,
}) {
  const router = useRouter()

  const { ref, isVisible } = useInViewAnimation<HTMLDivElement>();


  const goToAll = () => router.push('/#action-list')
  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl shadow-sm border p-4 transition-all duration-700 delay-400 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}>
      <div className="flex justify-between mb-4">
        <p className="font-semibold">Recent Actions</p>
        <button className={`text-${metric} text-sm`} onClick={goToAll}>View all</button>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-3">
        {actions.slice(0,200).map((action, i) => (
          <ActionCard action={action} key={i} metricTheme={metric} />
        ))}
      </div>

      <div className="text-center text-sm text-gray-400 mt-3">
        Scroll to see more...
      </div>
    </div>
  )
}