"use client"

import { Action, ActionDefinition, METRIC_KEYS, MetricKey, Tag } from "@/app/types"

import TagPill from "../TagPill"

import { convertTimestampToDayJS, dateToHumanString, formatSmartDate } from "@/app/lib/dateTime"
import { toSentenceCase } from "@/app/lib/utils"
import getDominantMetric from "@/app/lib/metrics/getDominantMetric"
import isActionNegative from "@/app/lib/actionDefinitions/isActionNegative"
import { Trash2 } from "lucide-react"
import { useApp } from "@/app/context/AppContext"

type Props = {
  action: Action
  quantity?: number
  metricTheme?: MetricKey
  className?: string
}

export default function ActionCard({ action, quantity, metricTheme, className }: Props) {
  const { actionDefinitions, deleteAction } = useApp()
  const definition = actionDefinitions.find(d => d.id === action.actionId)

  if (!definition) return;

  const metricToCardClasses = (metric: MetricKey | null) => {
    let className = ""
    if (!metric) className += "border-total bg-total/10"
    else if (metricTheme) className += `border-${metric} bg-gray-200/10`
    else className += `border-${metric} bg-${metric}/10`
    return className
  }

  const dominant = getDominantMetric(definition)
  const isNegative = isActionNegative(definition)
  const cardClasses = metricToCardClasses(metricTheme || dominant)

  const date = formatSmartDate(convertTimestampToDayJS(action.timestamp))
  const visibleTags = definition.tags.slice(0, 3)
  const extraTagCount = definition.tags.length - visibleTags.length

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${definition.name} at ${dateToHumanString(new Date(action.timestamp))}`))
      deleteAction(action.id)
  }


  return (
    <div
      className={`border-l-8 border rounded-r-lg p-3 mx-2 relative flex flex-col gap-1.5 ${cardClasses} ${isNegative && 'border-dashed'} ${className}`}
    >
      <button
        onClick={handleDelete} // or whatever you call it
        className="
          absolute top-2 right-2
          p-1 rounded-md
          bg-slate-600 text-white
          hover:bg-red-500
          active:bg-red-600
          transition-colors
        "
      >
        <Trash2 size={16} />
      </button>
      <div className="flex gap-2 min-w-0 min-h-4">
        {visibleTags.map((t: Tag) => (
          <TagPill key={t.id} tag={t.name} color={t.colorKey} />
        ))}

        {extraTagCount > 0 && (
          <div className="w-fit px-2 py-0.5 text-xs rounded-full border border-black/20 bg-black/5 text-black/70 font-medium">
            +{extraTagCount}
          </div>
        )}
      </div>
    <div className="flex items-center gap-4 whitespace-nowrap">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-x-2 min-w-0 flex-1">
        <span className="truncate font-bold text-sm">
          {definition.name}
        </span>

        {quantity !== undefined && quantity !== -1 && (
          <span className="italic shrink-0">{`x${quantity}`}</span>
        )}
      </div>

      {/* RIGHT SIDE (date) */}
      <span className="text-sm opacity-70 shrink-0">
        {date}
      </span>
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
            <span key={m} className={`${!metricTheme ? "font-semibold" : metricTheme === m ? 'font-semibold' : 'font-normal'} text-${!metricTheme ? m : metricTheme === m ? m : "gray-600"} text-shadow-lg`}>
              {toSentenceCase(m)} {definition[m] ? definition[m] > 0 ? "+" : "" : ""}{definition[m] ?? 0}
            </span>
          )}
        )}

      </div>

    </div>
  )
}