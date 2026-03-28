// app/context/AppContext.tsx

"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Action, ActionDefinition, Tag } from "@/app/types"
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
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [actions, setActions] = useState<Action[]>([])
  const [actionDefinitions, setActionDefinitions] = useState<ActionDefinition[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  async function logAction(actionId: number) {
    const timestamp = Date.now()

    const id = await ActionController.create({
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

  // initial load
  useEffect(() => {
    async function load() {
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
}