"use client"

import { Action, ActionDefinition, Tag } from "@/app/types"
import {
  resolveActionDetails,
  getDominantMetric,
  metricToCardClasses,
  getNonZeroMetrics
} from "@/app/lib/helpers"

import { convertTimestampToDayJS } from "@/app/lib/dateTime"
import { formatSmartDate } from "@/app/lib/dateTime"
import TagPill from "../TagPill"

type Props = {
  action: Action
  definitions: ActionDefinition[]
}

export default function ActionCardCondensed({ action, definitions }: Props) {

  const details = resolveActionDetails(action, definitions)
  
  const dominant = details ? getDominantMetric(details.metrics) : "mind"
  const cardClasses = metricToCardClasses(dominant)
  
  if (!details) return null
  
  const metrics = getNonZeroMetrics(details.metrics)
  const date = formatSmartDate(convertTimestampToDayJS(details.timestamp))
  const visibleTags = details.tags.slice(0, 3)
  const extraTagCount = details.tags.length - visibleTags.length

  return (
    <div className={`border-l-8 rounded-r-lg p-2.5 flex flex-col gap-1 ${cardClasses}`}>

  {/* Row 1 */}
  <div className="flex items-center gap-2 min-w-0">

    <div className="flex gap-1 shrink-0">
      {visibleTags.map((t: Tag) => (
        <TagPill key={t.id} tag={t.name} color={t.colorKey} />
      ))}

      {extraTagCount > 0 && (
        <div className="px-2 py-0.5 text-xs rounded-full bg-total/10 text-total">
          +{extraTagCount}
        </div>
      )}
    </div>

    <span className="truncate font-semibold flex-1">
      {details.name}
    </span>

    <span className="text-xs opacity-70 shrink-0">
      {date}
    </span>

  </div>

  {/* Row 2 */}
  <div className="flex gap-3 text-xs">

    {metrics.map(m => (
      <span key={m.key} className={`font-semibold text-${m.key}`}>
        {m.key[0].toUpperCase()}{m.value > 0 ? "+" : ""}{m.value}
      </span>
    ))}

  </div>

</div>
  )
}