"use client"

import { useEffect, useMemo, useState } from "react"
import { ActionController } from "@/app/controllers/ActionController"
import { ActionDefinitionController } from "@/app/controllers/ActionDefinitionController"
import { TagController } from "@/app/controllers/TagController"
import TagPill from "@/app/components/TagPill"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import { Action, ActionDefinitionDB, TagDB } from "@/app/types"
import { hydrateActions } from "@/app/utils/helpers"
import { AppProvider, useApp } from "@/app/context/AppContext"

export default function Page() {
  const { actions, tags, actionDefinitions, loading, addAction } = useApp()

  const sortedActionDefinitions = useMemo(() => {
    if (!actionDefinitions.length) return []

    const latestMap = new Map<number, number>()

    for (const action of actions) {
      const current = latestMap.get(action.actionId)

      if (!current || action.timestamp > current) {
        latestMap.set(action.actionId, action.timestamp)
      }
    }

    return [...actionDefinitions].sort((a, b) => {
      const aTime = latestMap.get(a.id!) ?? 0
      const bTime = latestMap.get(b.id!) ?? 0

      return bTime - aTime
    })
  }, [actionDefinitions, actions])

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-6">Track Actions</h1>

      <div className="flex flex-col">
        {sortedActionDefinitions.map((def, i) => {
          const defTags = def.tags

          return (
            <div
              key={def.id}
              className={`flex items-center justify-between border-b px-2 py-2 ${
                i % 2 === 0 ? "bg-gray-300" : "bg-white"
              }`}
            >
              {/* Left */}
              <div className="flex flex-col gap-1">
                <div className="font-medium">{def.name}</div>

                <div className="flex gap-2 flex-wrap">
                  {defTags.map(tag => (
                    <TagPill
                      key={tag.id}
                      tag={tag.name}
                      color={tag.colorKey}
                    />
                  ))}
                </div>
              </div>

              {/* Right */}
              <button
                onClick={() => addAction(def.id)}
                className="px-3 py-1 rounded bg-black text-white text-sm"
              >
                Log
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}