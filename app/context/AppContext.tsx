// app/context/AppContext.tsx

"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Action, ActionDefinition, ActionDefinitionDB, Tag, TagDB } from "@/app/types"
import { ActionController } from "@/app/controllers/ActionController"
import { ActionDefinitionController } from "@/app/controllers/ActionDefinitionController"
import { TagController } from "@/app/controllers/TagController"
import { hydrateActionDefinitions, hydrateActions } from "../utils/helpers"

type AppState = {
  actions: Action[]
  actionDefinitions: ActionDefinition[]
  tags: Tag[]
  loading: boolean

  addAction: (actionId: number) => Promise<void>
  addActionDefinition: (def: Omit<ActionDefinitionDB, 'id'>) => Promise<void>
  updateActionDefinition: (def: ActionDefinitionDB) => Promise<void>
  archiveActionDefinition: (id: number) => Promise<void>
  unarchiveActionDefinition: (id: number) => Promise<void>
  deleteActionDefinition: (id: number) => Promise<void>
  addTag: (def: Omit<Tag, 'id'>) => Promise<void>
  updateTag: (def: Tag) => Promise<void>
  deleteTag: (id: number) => Promise<void>
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [actions, setActions] = useState<Action[]>([])
  const [actionDefinitions, setActionDefinitions] = useState<ActionDefinition[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  async function addAction(actionId: number) {
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

  async function addActionDefinition(def: Omit<ActionDefinitionDB, 'id'>) {
    const id: number = await ActionDefinitionController.create(def)
    const defTags: Tag[] = tags.filter(t => def.tagIds.includes(t.id))

    const newDef: ActionDefinition = {
      ...def,
      id,
      tags: defTags,
    }

    setActionDefinitions(prev => [newDef, ...prev])
  }

  async function updateActionDefinition(def: ActionDefinitionDB) {
    await ActionDefinitionController.update(def)
    const defTags: Tag[] = tags.filter(t => def.tagIds.includes(t.id))
    const newDef = {
      ...def,
      tags: defTags
    }
    setActionDefinitions(prev => [newDef, ...prev.filter(d => d.id !== def.id)])
  }

  async function archiveActionDefinition(id: number) {
    setActionDefinitions(prev =>
      prev.map(d => {
        if(d.id === id) {
          console.log("MATCH ", id)
          return { ...d, archived: true }
        } else {
          return d
        }
      })
    )

    const def = await ActionDefinitionController.get(id)
    if (def) {
      await ActionDefinitionController.update({
        ...def,
        archived: true
      })
    }
  }
  
  async function unarchiveActionDefinition(id: number) {
    ActionDefinitionController.get(id).then(def => {
      def && ActionDefinitionController.update({
        ...def,
        archived: false
      })
    })
    setActionDefinitions(prev => [...prev.map(d=>d.id===id ? {...d, archived: false} : d)])
  }

  async function deleteActionDefinition(id: number) {
    ActionDefinitionController.delete(id)
    setActionDefinitions(prev => [...prev.filter(def=>def.id !== id)])
  }

  async function addTag(tag: Omit<Tag, 'id'>) {
    const id = await TagController.create(tag.name, tag.colorKey)
    setTags(prev => [{...tag, id}, ...prev])
  }

  async function updateTag(tag: Tag) {
    await TagController.update(tag)
    setTags(prev => [tag, ...prev.filter(t => t.id !== tag.id)])
  }

  async function deleteTag(id :number) {
    TagController.delete(id)
    setTags(prev => [...prev.filter(t => t.id !== id)])
    setActionDefinitions((prev) => prev.map((def)=>{return {...def,tags:def.tags.filter(t=>t.id!==id)}}))
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
          addAction,
          addActionDefinition,
          updateActionDefinition,
          archiveActionDefinition,
          unarchiveActionDefinition,
          deleteActionDefinition,
          addTag,
          updateTag,
          deleteTag,
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