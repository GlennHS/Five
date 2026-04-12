"use client"

import { ActionDefinition, METRIC_KEYS, MetricKey } from "@/app/types"
import { Plus, Sliders, Star } from "lucide-react"
import TagPill from "@/app/components/TagPill"
import { toSentenceCase } from "@/app/lib/utils"

type Props = {
  def: ActionDefinition
  onLog: (def: ActionDefinition) => void
  onAdvancedLog: (def: ActionDefinition) => void
  className?: string
  simple?: boolean
}

export default function TrackCard({ def, onLog, onAdvancedLog, className, simple }: Props) {

  const getBGString = (key: MetricKey): string => {
    if (def[key] && def[key] !== 0)
      return `bg-${key}/50`
    return `bg-${key}/10`
  }

  return (
    <div
      className={`flex flex-col gap-2 border-y p-2 ${className}`}
    >
      {/* Top */}
      <div className="flex w-full justify-between items-center gap-1">
        <div className={`flex items-center gap-2 ${simple ? 'text-sm' : 'font-medium'}`}>
          { simple && <Star strokeWidth={0} fill="#777" /> }
          { def.name }
        </div>

        <div className="rounded-2xl border-2 border-black flex overflow-hidden">
          <button
            onClick={() => onAdvancedLog(def)}
            className="px-3 py-1 bg-gray-400 text-white text-sm border-r border-gray-700 active:bg-gray-600"
          >
            <Sliders size={simple ? 16 : 30} />
          </button>

          <button
            onClick={() => onLog(def)}
            className="px-3 py-1 bg-gray-400 text-white text-sm border-r border-gray-700 active:bg-gray-600"
          >
            <Plus size={simple ? 16 : 30} />
          </button>
        </div>
      </div>
      { !simple && (
        <>
          {/* Tags */}
          <div className="flex gap-x-2 flex-wrap w-full">
            {def.tags.map(tag => (
              <TagPill
                key={tag.id}
                tag={tag.name}
                color={tag.colorKey}
              />
            ))}
          </div>

          {/* Metrics */}
          <div className="flex rounded-xl border-black border-2 overflow-hidden w-full">
            {METRIC_KEYS.map((key, i) => (
              <div
                key={key}
                className={`flex flex-col px-1 py-0.5 w-full ${getBGString(key)} ${
                  i === 0 ? "rounded-l-xl" : ""
                } ${i === METRIC_KEYS.length - 1 ? "rounded-r-xl" : ""}`}
              >
                <span className="text-center text-sm">{toSentenceCase(key)}</span>
                <span className="text-center text-sm">{def[key]}</span>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  )
}