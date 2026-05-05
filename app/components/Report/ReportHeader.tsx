import { dateToReportFormat } from "@/app/lib/dateTime"
import dayjs from "dayjs"

export default function ReportHeader({
  start,
  end,
}: {
  start: dayjs.Dayjs
  end: dayjs.Dayjs
}) {
  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Weekly Report</h1>
        <p className="text-sm text-gray-500 mt-1">{dateToReportFormat(start)} – {dateToReportFormat(end)}</p>
      </div>
    </div>
  )
}