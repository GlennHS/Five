import dayjs from "dayjs"

export default function ReportHeader({
  start,
  end,
}: {
  start: dayjs.Dayjs
  end: dayjs.Dayjs
}) {
  const fmt = (d: dayjs.Dayjs) => d.format("D MMM")

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Weekly Report</h1>
        <p className="text-sm text-gray-500 mt-1">{fmt(start)} – {fmt(end)}</p>
      </div>
    </div>
  )
}