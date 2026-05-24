"use client"

import { ActionDefinition } from "@/app/types"
import { Plus, Sliders } from "lucide-react"
import FavouriteStar from "./FavouriteStar"

type Props = {
  def: ActionDefinition
  onLog: (def: ActionDefinition) => void
  onAdvancedLog: (def: ActionDefinition) => void
  onFavourite: () => void
  className?: string
}

export default function SimpleTrackCard({ def, onLog, onAdvancedLog, onFavourite, className }: Props) {
  return (
    <div className={`flex items-center justify-between gap-3 py-2.5 px-1 ${className}`}>
      {/* Left — star + name */}
      <div className="flex items-center gap-2 min-w-0">
        <FavouriteStar isFilled={def.favourite} onClick={onFavourite} />
        <span className="text-sm font-medium text-gray-800 truncate">
          {def.name}
        </span>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Secondary: advanced log */}
        <button
          onClick={() => onAdvancedLog(def)}
          className="p-1.5 rounded-lg text-gray-400"
          aria-label="Advanced log"
        >
          <Sliders size={15} />
        </button>

        {/* Primary: quick log */}
        <button
          onClick={() => onLog(def)}
          className="flex items-center p-0.5 text-gray-800 text-xs font-semibold"
          aria-label="Log action"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
