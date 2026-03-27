"use client"

import { useEffect, useMemo, useState } from "react"
import { ActionController } from "@/app/controllers/ActionController"
import { ActionDefinitionController } from "@/app/controllers/ActionDefinitionController"
import { TagController } from "@/app/controllers/TagController"
import TagPill from "@/app/components/TagPill"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import { Action, ActionDefinitionDB, TagDB } from "@/app/types"
import { hydrateActions } from "@/app/utils/helpers"

export default function Page() {
  const [definitions, setDefinitions] = useState<ActionDefinitionDB[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [tags, setTags] = useState<TagDB[]>([])

  useEffect(() => {
    async function load() {
      const [defs, acts, tags] = await Promise.all([
        ActionDefinitionController.getAll(),
        ActionController.getAll(),
        TagController.getAll()
      ])

      setDefinitions(defs)
      setActions(hydrateActions(acts))
      setTags(tags)
    }

    load()
  }, [])

  const sortedDefinitions = useMemo(() => {
    if (!definitions.length) return []

    const latestMap = new Map<number, number>()

    for (const action of actions) {
      const current = latestMap.get(action.actionId)

      if (!current || action.timestamp > current) {
        latestMap.set(action.actionId, action.timestamp)
      }
    }

    return [...definitions].sort((a, b) => {
      const aTime = latestMap.get(a.id!) ?? 0
      const bTime = latestMap.get(b.id!) ?? 0

      return bTime - aTime
    })
  }, [definitions, actions])

  function getTagsForDefinition(def: ActionDefinitionDB) {
    return def.tagIds
      .map(id => tags.find(t => t.id === id))
      .filter(Boolean) as TagDB[]
  }

  async function handleLog(def: ActionDefinitionDB) {
    const timestamp = Date.now()

    console.info(`Creating a new Action in the DB...`)
    console.debug(`Action definition is ${JSON.stringify(def)}`)
    
    const id = await ActionController.create({
      actionId: def.id!,
      timestamp,
      note: ""
    })

    console.debug(`Action added to DB. ID is ${id}`)

    // optimistic update
    setActions(prev => [
      ...prev,
      {
        actionId: def.id!,
        timestamp,
        note: ""
      }
    ])
  }

  const isLoading =
    definitions.length === 0 && actions.length === 0 && tags.length === 0

  if (isLoading) {
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
        {sortedDefinitions.map((def, i) => {
          const defTags = getTagsForDefinition(def)

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
                onClick={() => handleLog(def)}
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