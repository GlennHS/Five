"use client"

import { ActionDefinition } from "@/app/types"
import { Plus, Sliders, Star } from "lucide-react"

type Props = {
  def: ActionDefinition
  onLog: (def: ActionDefinition) => void
  onAdvancedLog: (def: ActionDefinition) => void
  className?: string
}

export default function SimpleTrackCard({ def, onLog, onAdvancedLog, className }: Props) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex flex-col gap-2 w-full py-2">
        <div className="flex w-full justify-between items-center gap-1">
          <div className="flex items-center gap-2 text-sm">
            <Star strokeWidth={0} fill="#777" />
            {def.name}
          </div>

          <div className="rounded-2xl border-2 border-black flex overflow-hidden">
            <button
              onClick={() => onAdvancedLog(def)}
              className="px-3 py-1 bg-gray-400 text-white text-sm border-r border-gray-700 active:bg-gray-600"
            >
              <Sliders size={16} />
            </button>
            <button
              onClick={() => onLog(def)}
              className="px-3 py-1 bg-gray-400 text-white text-sm active:bg-gray-600"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}