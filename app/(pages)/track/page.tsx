"use client"

import { useEffect, useMemo, useState } from "react"
import { ActionController } from "@/app/controllers/ActionController"
import { ActionDefinitionController } from "@/app/controllers/ActionDefinitionController"
import { TagController } from "@/app/controllers/TagController"
import TagPill from "@/app/components/TagPill"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import { Action, ActionDefinition, ActionDefinitionDB, METRIC_KEYS, MetricKey, TagDB } from "@/app/types"
import { hydrateActions, toSentenceCase } from "@/app/utils/helpers"
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

  const getBGString = (key: MetricKey, def: ActionDefinition): string => {
    if (def[key] && def[key] !== 0)
      return `bg-${key}/50`
    else
      return `bg-${key}/10`
  }

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

      <div>
        {/* Search Bar */}
        {/* Tag Filtering */}
        {/* Order by Metric / Alpha [asc/desc] */}
      </div>

      <div className="flex flex-col">
        {sortedActionDefinitions.map((def, i) => {
          return (
            <div
              key={def.id}
              className={`flex flex-col items-baseline justify-center gap-2 border-b p-2 ${
                i % 2 === 0 ? "bg-gray-300" : "bg-white"
              }`}
            >
              {/* Top */}
              <div className="flex w-full justify-between gap-1">
                <div className="font-medium">{def.name}</div>

                <button
                  onClick={() => addAction(def.id)}
                  className="px-3 py-1 rounded bg-black text-white text-sm"
                >
                  Log
                </button>
              </div>

              <div className="flex gap-x-2 flex-wrap w-full">
                {def.tags.map(tag => (
                  <TagPill
                    key={tag.id}
                    tag={tag.name}
                    color={tag.colorKey}
                  />
                ))}
              </div>

              <div className="flex rounded-xl border-black border-2 overflow-hidden w-full">
                {METRIC_KEYS.map((key, i) => (
                  <div key={key} className={`flex flex-col gap-0.5 px-1 py-0.5 ${getBGString(key, def)} w-full ${i === 0 ? "rounded-l-xl" : ""} ${i === METRIC_KEYS.length - 1 ? "rounded-r-l" : ""}`}>
                    <span className="text-center text-sm">{toSentenceCase(key)}</span>
                    <span className="text-center text-sm">{def[key]}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}