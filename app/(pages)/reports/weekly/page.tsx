"use client"

import { useApp } from "@/app/context/AppContext"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import { useWeeklyReport } from "@/app/hooks/useWeeklyReport"
import ReportHeader from "@/app/components/Report/ReportHeader"
import ReportSummary from "@/app/components/Report/ReportSummary"
import ReportOverviewCards from "@/app/components/Report/ReportOverviewCards"
import ReportHeatmap from "@/app/components/Report/ReportHeatmap"
import ReportMetricCard from "@/app/components/Report/ReportMetricCard"
import ReportInsights from "@/app/components/Report/ReportInsights"
import BackLink from "@/app/components/BackLink"

export default function ReportPage() {
  const { actions, actionDefinitions, loading } = useApp()
  const report = useWeeklyReport(actions, actionDefinitions)

  if (loading) return <LoadingSpinner />

  const allFlat = report.metrics.every(m => m.change === 0)
  const focused = report.metrics.find(m => m.metric === report.focusedMetric)!
  const neglected = report.metrics.find(m => m.metric === report.neglectedMetric)!

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-6 space-y-4 max-w-xl mx-auto">
      <BackLink />
      <ReportHeader start={report.thisWeek.start} end={report.thisWeek.end} />

      <ReportOverviewCards report={report} />

      {!allFlat && (
        <ReportSummary
          focusedMetric={report.focusedMetric}
          neglectedMetric={report.neglectedMetric}
          focusedChange={focused.change}
          neglectedChange={neglected.change}
        />
      )}

      <ReportHeatmap heatmap={report.heatmap} />

      <ReportInsights />

      <div className="space-y-4">
        {report.metrics.map(m => (
          <ReportMetricCard key={m.metric} report={m} />
        ))}
      </div>
    </div>
  )
}