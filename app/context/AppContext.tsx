// app/context/AppContext.tsx

"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Action, ActionDefinition, ActionDefinitionDB, Tag } from "@/app/types"
import { ActionController } from "@/app/controllers/ActionController"
import { ActionDefinitionController } from "@/app/controllers/ActionDefinitionController"
import { TagController } from "@/app/controllers/TagController"
import { hydrateActionDefinitions, hydrateActions } from "../utils/helpers"

type AppState = {
  actions: Action[]
  actionDefinitions: ActionDefinition[]
  tags: Tag[]
  loading: boolean

  logAction: (actionId: number) => Promise<void>
  addActionDefinition: (def: ActionDefinition) => Promise<void>
  updateActionDefinition: (def: ActionDefinition) => Promise<void>
  archiveActionDefinition: (id: number) => Promise<void>
  deleteActionDefinition: (id: number) => Promise<void>
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [actions, setActions] = useState<Action[]>([])
  const [actionDefinitions, setActionDefinitions] = useState<ActionDefinition[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  async function logAction(actionId: number) {
    const timestamp = Date.now()

    const id: number = await ActionController.create({
      actionId,
      timestamp,
      note: ""
    })

    const newAction: Action = {
      id,
      actionId,
      timestamp,
      note: ""
    }

    // optimistic update
    setActions(prev => [...prev, newAction])
  }

  async function addActionDefinition(def: Omit<ActionDefinition, 'id'>) {
    const id: number = await ActionDefinitionController.create({
      name: def.name,
      tagIds: def.tags.map(t => t.id),
      mind: def.mind ?? 0,
      body: def.body ?? 0,
      work: def.work ?? 0,
      cash: def.cash ?? 0,
      bond: def.bond ?? 0,
      archived: false,
    })

    const newDef: ActionDefinition = {
      id,
      ...def,
    }

    setActionDefinitions(prev => [...prev, newDef])
  }

  async function updateActionDefinition(def: ActionDefinition) {
    await ActionDefinitionController.update({
      id: def.id,
      name: def.name,
      tagIds: def.tags.map(t => t.id),
      mind: def.mind ?? 0,
      body: def.body ?? 0,
      work: def.work ?? 0,
      cash: def.cash ?? 0,
      bond: def.bond ?? 0,
      archived: false,
    })
    setActionDefinitions(prev => [...prev.filter(d => d.id !== def.id), def])
  }

  async function archiveActionDefinition(id: number) {

  }

  async function deleteActionDefinition(id: number) {

  }

  // initial load
  useEffect(() => {
    async function load() {
      setLoading(true)
      // await new Promise(resolve => setTimeout(resolve, 3000)) // Test loading states with this
      const [tags, defs, acts] = await Promise.all([
        TagController.getAll(),
        ActionDefinitionController.getAll(),
        ActionController.getAll()
      ])

      // hydrate here once
      setTags(tags)
      setActionDefinitions(hydrateActionDefinitions(defs, tags))
      setActions(hydrateActions(acts))

      setLoading(false)
    }

    load()
  }, [])

    return (
      <AppContext.Provider
        value={{
          actions,
          actionDefinitions,
          tags,
          loading,
          logAction,
          addActionDefinition,
          updateActionDefinition,
          archiveActionDefinition,
          deleteActionDefinition,
        }}
      >
        {children}
      </AppContext.Provider>
    )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}