"use client"

import { ActionDefinition, METRIC_KEYS, MetricKey } from "@/app/types"
import { Plus, Sliders } from "lucide-react"
import TagPill from "@/app/components/TagPill"
import { toSentenceCase } from "@/app/lib/utils"
import { useApp } from "@/app/context/AppContext"
import { dateToHumanString, formatSmartDate } from "@/app/lib/dateTime"
import dayjs from "dayjs"
import FavouriteStar from "./FavouriteStar"

type Props = {
  def: ActionDefinition
  onLog: (def: ActionDefinition) => void
  onAdvancedLog: (def: ActionDefinition) => void
  onFavourite: () => void
  className?: string
}

const getBGString = (def: ActionDefinition, key: MetricKey): string => {
  if (def[key] && def[key] !== 0) return `bg-${key}/50`
  return `bg-${key}/10`
}

export default function FullTrackCard({ def, onLog, onAdvancedLog, onFavourite, className }: Props) {
  const { lastLoggedMap } = useApp()
  const lastLogged = lastLoggedMap[def.id]

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Left side */}
      <div className="flex flex-col gap-2 w-full py-2">
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-2">
            <FavouriteStar isFilled={def.favourite} onClick={onFavourite} />
            <span className="font-medium">{def.name}</span>
          </div>
          <span className="text-2xs opacity-50 font-semibold">Last logged: {formatSmartDate(dayjs(lastLogged))}</span>
        </div>


        {/* Tags */}
        <div className="flex gap-x-2 flex-wrap w-full">
          {def.tags.map((tag) => (
            <TagPill key={tag.id} tag={tag.name} color={tag.colorKey} />
          ))}
        </div>

        {/* Metrics */}
        <div className="flex rounded-xl border-black border-2 overflow-hidden w-full">
          {METRIC_KEYS.map((key, i) => (
            <div
              key={key}
              className={`
                flex flex-col px-1 py-0.5 w-full
                ${getBGString(def, key)}
                ${i === 0 ? "rounded-l-xl" : ""}
                ${i === METRIC_KEYS.length - 1 ? "rounded-r-xl" : ""}
              `}
            >
              <span className="text-center text-sm">{toSentenceCase(key)}</span>
              <span className="text-center text-sm">{def[key]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right side buttons */}
      <div className="flex flex-col overflow-hidden">
        <button
          onClick={() => onAdvancedLog(def)}
          className="flex-1 flex items-center justify-center px-2 bg-gray-500 text-white active:bg-gray-600 border-b-2 border-white"
        >
          <Sliders size={20} strokeWidth={3} />
        </button>
        <button
          onClick={() => onLog(def)}
          className="flex-1 flex items-center justify-center px-2 bg-gray-400 text-white active:bg-gray-600"
        >
          <Plus size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  )
}