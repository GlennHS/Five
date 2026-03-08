import { Metric } from "../types"

type MetricCardProps = {
  metric: Metric,
  isActive?: boolean;
  onClick?: () => void
}

export default function MetricCard({ metric, isActive, onClick }: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl p-4 shadow-sm text-white flex flex-col justify-between
        bg-${metric.name.toLowerCase()}
        cursor-pointer select-none transition
        hover:-translate-y-0.5 hover:shadow-md
        ${isActive ? "ring-2 ring-offset-2 ring-slate-900 ring-offset-white" : ""}
      `}
    >
      <h3 className="text-lg font-semibold tracking-wide">
        {metric.name}
      </h3>
      <p className="mt-2 text-sm font-medium opacity-90 uppercase">
        {metric.value}
      </p>
    </div>
  )
}
