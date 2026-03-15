"use client"

import { Action, ActionDefinition } from "@/app/types"
import {
  resolveActionDetails,
  formatMetricSummary,
  getDominantMetric,
  metricToBackgroundClass
} from "@/app/utils/helpers"

import { convertTimestampToDayJS } from "@/app/utils/dateTime"
import { formatSmartDate } from "@/app/utils/dateTime"

type Props = {
  action: Action
  definitions: ActionDefinition[]
}

export default function ActionCardCondensed({ action, definitions }: Props) {

  const details = resolveActionDetails(action, definitions)
  if (!details) return null

  const summary = formatMetricSummary(details.metrics)

  const dominant = getDominantMetric(details.metrics)
  const bgClass = metricToBackgroundClass(dominant)

  const date = formatSmartDate(
    convertTimestampToDayJS(details.timestamp)
  )

  return (
    <div className={`rounded-md px-3 py-2 flex justify-between items-center text-sm ${bgClass}`}>

      <div className="font-medium">
        {details.name}
      </div>

      <div className="opacity-70">
        {date}
      </div>

      <div className="font-mono">
        {summary}
      </div>

    </div>
  )
}