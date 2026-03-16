"use client"

import { Action, ActionDefinition } from "@/app/types"
import { resolveActionDetails, getNonZeroMetrics, toSentenceCase, getDominantMetric, metricToCardClasses } from "@/app/utils/helpers"
import { convertTimestampToDayJS, formatSmartDate } from "@/app/utils/dateTime"

type Props = {
  action: Action
  definitions: ActionDefinition[]
}

export default function ActionCard({ action, definitions }: Props) {

  const details = resolveActionDetails(action, definitions)

  const dominant = details ? getDominantMetric(details.metrics) : "mind"
  const cardClasses = metricToCardClasses(dominant, details?.tags ?? [])

  if (!details) return null

  const metrics = getNonZeroMetrics(details.metrics)

  const date = formatSmartDate(convertTimestampToDayJS(details.timestamp))

  return (
    <div className={`border rounded-lg p-3 flex flex-col gap-2 ${cardClasses}`}>
      <div className="flex justify-between items-center gap-4 whitespace-nowrap">
        <span className="truncate w-fit font-bold whitespace-nowrap">{details.name}</span>
        <span className="text-sm opacity-70">{date}</span>
      </div>

      {details.note && (
        <div className="text-sm italic opacity-80">
          {details.note}
        </div>
      )}

      <div className="flex gap-3 text-sm">

        {metrics.map(m => (
          <span key={m.key} className={`font-semibold text-${m.key} text-shadow-lg`}>
            {toSentenceCase(m.key)} {m.value > 0 ? "+" : ""}{m.value}
          </span>
        ))}

      </div>

    </div>
  )
}