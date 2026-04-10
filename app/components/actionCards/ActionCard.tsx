"use client"

import { Action, ActionDefinition, METRIC_KEYS, MetricKey, Tag } from "@/app/types"

import TagPill from "../TagPill"

import { convertTimestampToDayJS, formatSmartDate } from "@/app/lib/dateTime"
import { toSentenceCase } from "@/app/lib/utils"
import getDominantMetric from "@/app/lib/metrics/getDominantMetric"
import isActionNegative from "@/app/lib/actionDefinitions/isActionNegative"

type Props = {
  action: Action
  definition: ActionDefinition
  quantity?: number
}

export default function ActionCard({ action, definition, quantity }: Props) {
  const metricToCardClasses = (metric: MetricKey | null) => {
    let className = ""
    if (!metric) className += "border-total bg-total/10"
    else className += `border-${metric} bg-${metric}/10`
    return className
  }

  const dominant = getDominantMetric(definition)
  const isNegative = isActionNegative(definition)
  const cardClasses = metricToCardClasses(dominant)

  const date = formatSmartDate(convertTimestampToDayJS(action.timestamp))
  const visibleTags = definition.tags.slice(0, 3)
  const extraTagCount = definition.tags.length - visibleTags.length


  return (
    <div
      className={`border-l-8 border rounded-r-lg p-3 mx-2 flex flex-col gap-1.5 ${cardClasses} ${isNegative && 'border-dashed'}`}
      >
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
      <div className="flex items-center justify-baseline gap-x-2">
        <span className="truncate font-bold flex-1">
          {definition.name}
        </span>
        { quantity !== undefined && quantity !== -1 && (<span className="italic">{`x${quantity}`}</span>)}
      </div>
      <span className="text-sm opacity-70">{date}</span>
    </div>

      {action.note && (
        <div className="text-sm italic opacity-80">
          {action.note}
        </div>
      )}

      <div className="flex gap-3 text-sm">
        {METRIC_KEYS.map(m => {
          if (definition[m])
          return (
            <span key={m} className={`font-semibold text-${m} text-shadow-lg`}>
              {toSentenceCase(m)} {definition[m] ? definition[m] > 0 ? "+" : "" : ""}{definition[m] ?? 0}
            </span>
          )}
        )}

      </div>

    </div>
  )
}