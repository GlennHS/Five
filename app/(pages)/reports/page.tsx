"use client"

import BackLink from "@/app/components/BackLink"
import { dateToReportFormat } from "@/app/lib/dateTime"
import dayjs from "dayjs"
import Link from "next/link"
import { useMemo } from "react"

export default function Page() {
  const getWeekBounds = useMemo(() => {
    const now = dayjs()
    const daysSinceMonday = (now.day() === 0 ? 7 : now.day()) - 1
    // +7 ensures we always start from the last *completed* Mon–Sun week
    const lastMonday = now.subtract(daysSinceMonday + 7, 'day').startOf('day')
  
    return {
      start: lastMonday,
      end: lastMonday.add(6, 'day').endOf('day'),
    }
  }, [])

  return (
    <div className="pb-4">
      <BackLink />
      <h1 className="my-4! font-bold text-lg">Settings</h1>

      <div className="flex flex-col gap-y-4 w-full">
        <Link
          href="/reports/weekly"
          className="p-4 rounded-2xl border border-gray-300 w-full"
        >
          <div className="font-semibold">Weekly Report</div>
          <div className="opacity-60 text-sm">
            Report showing {dateToReportFormat(getWeekBounds.start)} - {dateToReportFormat(getWeekBounds.end)}
          </div>
        </Link>
      </div>
    </div>
  )
}