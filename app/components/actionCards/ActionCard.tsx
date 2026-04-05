"use client"

import { Action, ActionDefinition, MetricKey, Tag } from "@/app/types"

import TagPill from "../TagPill"

import { convertTimestampToDayJS, formatSmartDate } from "@/app/lib/dateTime"
import { toSentenceCase } from "@/app/lib/utils"
import getActionDetails from "@/app/lib/actions/getActionDetails"
import getDominantMetric from "@/app/lib/metrics/getDominantMetric"
import getNonZeroMetrics from "@/app/lib/metrics/getNonZeroMetrics"

type Props = {
  action: Action
  definitions: ActionDefinition[]
}

export default function ActionCard({ action, definitions }: Props) {

  const details = getActionDetails(action, definitions)

  const metricToCardClasses = (metric: MetricKey | null) => {
    let className = ""
    if (!metric) className += "border-total bg-total/10"
    else className += `border-${metric} bg-${metric}/10`
    return className
  }

  const dominant = details ? getDominantMetric(details.metrics) : "mind"
  const cardClasses = metricToCardClasses(dominant)
  
  if (!details) return null
  
  const metrics = getNonZeroMetrics(details.metrics)
  const date = formatSmartDate(convertTimestampToDayJS(details.timestamp))
  const visibleTags = details.tags.slice(0, 3)
  const extraTagCount = details.tags.length - visibleTags.length


  return (
    <div className={`border-l-8 rounded-r-lg p-3 mx-2 flex flex-col gap-1.5 ${cardClasses}`}>
      <div className="flex gap-2 min-w-0">
        {visibleTags.map((t: Tag) => (
          <TagPill key={t.id} tag={t.name} color={t.colorKey} />
        ))}

        {extraTagCount > 0 && (
          <div className="w-fit px-2 py-0.5 text-xs rounded-full border border-black/20 bg-black/5 text-black/70 font-medium">
            +{extraTagCount}
          </div>
        )}
      </div>
    <div className="flex justify-between items-center gap-4 whitespace-nowrap">
      <span className="truncate font-bold flex-1">
        {details.name}
      </span>
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