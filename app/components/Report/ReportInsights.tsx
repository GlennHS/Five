import { useInViewAnimation } from "../useInViewAnimation"

// TODO: modify useInsights to accept a date range, then wire it in here:
// const insights = useInsights(actions, defs, thisWeek.start, thisWeek.end)

export default function ReportInsights() {
  const { ref, isVisible } = useInViewAnimation<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`bg-white border rounded-2xl p-4 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <p className="font-semibold text-sm mb-2">Insights</p>
      <p className="text-xs text-neutral-400 italic">Coming soon — insights for this week.</p>
    </div>
  )
}