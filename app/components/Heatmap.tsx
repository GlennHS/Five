import { Dayjs } from "dayjs"
import { HeatmapDay, MetricKey } from "../types"

interface Props {
  metric: MetricKey,
  days: HeatmapDay[],
}

function getOpacity(value: number): string {
  if (value <= 0) return "opacity-10"
  if (value < 3) return "opacity-30"
  if (value < 6) return "opacity-60"
  return "opacity-100"
}

function getDateString(day: Dayjs): string {
  return day.format('ddd')
}

export default function Heatmap({ metric, days }: Props) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map(cell => (
        <div key={cell.day.valueOf()} className="flex flex-col items-center gap-0.5">
          <div
            className={`w-full aspect-square rounded-md bg-${metric} ${getOpacity(cell.value)}`}
            title={`${getDateString(cell.day)}: ${cell.value}`}
          />
          <span className="text-[9px] text-neutral-400">{cell.day.format('ddd')}</span>
        </div>
      ))}
    </div>
  )
}