import { Metric } from "../types"

type MetricCardProps = {
  metric: Metric
}

export default function MetricCard(props: MetricCardProps) {
  return (
    <div
      key={props.metric.name}
      className={`rounded-2xl p-4 shadow-sm text-white flex flex-col justify-between bg-${props.metric.name.toLowerCase()}`}
    >
      <h3 className="text-lg font-semibold tracking-wide">
        {props.metric.name}
      </h3>
      <p className="mt-2 text-sm font-medium opacity-90 uppercase">
        {props.metric.value}
      </p>
    </div>
  )
}