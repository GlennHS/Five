"use client"

import { useState } from "react"
import TagPill from "@/app/components/TagPill"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import { Archive, ArchiveRestore, Pencil, Plus, Save, SaveOff, Trash } from "lucide-react"
import { ActionDefinitionDB, ActionDefinition } from "@/app/types"
import BackLink from "@/app/components/BackLink"
import { NumberStepper } from "@/app/components/NumberStepper"
import { useApp } from "@/app/context/AppContext"

type MetricKey = "mind" | "body" | "work" | "cash" | "bond"

const METRICS: MetricKey[] = ["mind", "body", "work", "cash", "bond"]

export default function Page() {
  const {
    loading,
    tags,
    actionDefinitions,
    addActionDefinition,
    updateActionDefinition,
    archiveActionDefinition,
    unarchiveActionDefinition,
    deleteActionDefinition
  } = useApp()

  const [name, setName] = useState("")
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [metrics, setMetrics] = useState<Record<MetricKey, number>>({
    mind: 0,
    body: 0,
    work: 0,
    cash: 0,
    bond: 0
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")
  const [editTagIds, setEditTagIds] = useState<number[]>([])
  const [editMetrics, setEditMetrics] = useState<Record<MetricKey, number>>({
    mind: 0,
    body: 0,
    work: 0,
    cash: 0,
    bond: 0
  })

  function startEdit(action: ActionDefinition) {
    setEditingId(action.id!)
    setEditName(action.name)
    setEditTagIds(action.tags.map(t=>t.id))
    setEditMetrics({
      mind: action.mind ?? 0,
      body: action.body ?? 0,
      work: action.work ?? 0,
      cash: action.cash ?? 0,
      bond: action.bond ?? 0
    })
  }

  function toggleEditTag(id: number) {
    setEditTagIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )
  }

  function updateEditMetric(key: MetricKey, value: number) {
    setEditMetrics(prev => ({
      ...prev,
      [key]: value
    }))
  }

  async function saveEdit(id: number) {
  if (!editName.trim()) return

  const updated: ActionDefinitionDB = {
    id,
    name: editName,
    tagIds: editTagIds,
    ...editMetrics,
    archived: false,
  }

  updateActionDefinition(updated)
  setEditingId(null)
}

  function cancelEdit() {
    setEditingId(null)
    setEditName("")
  }

  function toggleTag(id: number) {
    setSelectedTagIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )
  }

  function updateMetric(key: MetricKey, value: number) {
    setMetrics(prev => ({
      ...prev,
      [key]: value
    }))
  }

  async function handleAdd() {
    if (!name.trim()) return

    const newDef: Omit<ActionDefinitionDB, "id"> = {
      name,
      tagIds: selectedTagIds,
      ...metrics,
      archived: false,
    }

    const id = await addActionDefinition(newDef)

    // reset form
    setName("")
    setSelectedTagIds([])
    setMetrics({
      mind: 0,
      body: 0,
      work: 0,
      cash: 0,
      bond: 0
    })
  }

  async function handleDelete(id?: number) {
    if (!id) return

    const confirmDelete = confirm("Delete this action?")
    if (!confirmDelete) return

    deleteActionDefinition(id)
  }
  
  async function handleArchive(id?: number) {
    if (!id) return

    archiveActionDefinition(id)
  }

  async function handleUnarchive(id?: number) {
    if (!id) return

    unarchiveActionDefinition(id)
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
      <BackLink />
      <h1 className="text-xl font-semibold mb-6">Edit ActionDefinitions</h1>

      {/* Create */}
      <div className="flex flex-col gap-3 mb-6 border p-4 rounded-lg">
        <input
          className="border rounded-lg px-3 py-2"
          placeholder="Action name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => {
            const selected = selectedTagIds.includes(tag.id!)

            return (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id!)}
                className={`rounded-full ${
                  selected ? "ring-2 ring-black" : ""
                }`}
              >
                <TagPill tag={tag.name} color={tag.colorKey} />
              </button>
            )
          })}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-5 gap-x-2">
          {METRICS.map(m => (<span className="text-center text-xs" key={m}>{m.toUpperCase()}</span>))}
          {METRICS.map(metric => (
            <NumberStepper
              key={metric}
              onChange={(val: number) => updateMetric(metric, val)}
              value={metrics[metric]}
              metricName={metric}
            />
          ))}
        </div>

        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded-lg border-2 w-fit"
        >
          <Plus />
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col">
        {actionDefinitions
          .sort((a, b) => (a.archived === b.archived ? 0 : a.archived ? 1 : -1))
          .map((action, i) => {
          const actionTags = action.tags
          const isEditing = editingId === action.id

          return (
            <div
              key={action.id}
              className={`flex flex-col gap-2 border-b-2 px-2 py-2 ${
                i % 2 === 0 ? "bg-gray-300" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center">
                {isEditing ? (
                  <input
                    className="border px-2 py-1 rounded"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                  />
                ) : (
                  <div className="font-medium">
                    {action.archived && (<span className="italic font-semibold">[Archived] </span>)}
                    {action.name}
                  </div>
                )}

                {isEditing ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => saveEdit(action.id!)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      <Save strokeWidth={2} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-red-400 px-2 py-1 rounded"
                    >
                      <SaveOff strokeWidth={2} />
                    </button>
                  </div>
                ) : (
                  <div>
                    {action.archived ? (
                      <>
                        <button
                          onClick={() => handleUnarchive(action.id)}
                          className="hover:bg-red-100 rounded p-1"
                        >
                          <ArchiveRestore size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(action.id)}
                          className="hover:bg-red-100 rounded p-1"
                        >
                          <Trash size={18} color="#ff3434"/>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(action)}
                          className="hover:bg-red-100 rounded p-1"
                        >
                          <Pencil size={18} strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => handleArchive(action.id)}
                          className="hover:bg-red-100 rounded p-1"
                        >
                          <Archive size={18} color="#5e5e5e" />
                      </button>
                      </>
                    )}
                  </div>
                )}
               </div>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                {(isEditing ? tags : actionTags).map(tag => {
                  const selected = isEditing
                    ? editTagIds.includes(tag.id!)
                    : action.tags.includes(tag)

                  return isEditing ? (
                    <button
                      key={tag.id}
                      onClick={() => toggleEditTag(tag.id!)}
                      className={`rounded-full ${
                        selected ? "ring-2 ring-black" : ""
                      }`}
                    >
                      <TagPill tag={tag.name} color={tag.colorKey} />
                    </button>
                  ) : (
                    <TagPill
                      key={tag.id}
                      tag={tag.name}
                      color={tag.colorKey}
                    />
                  )
                })}
              </div>

              {/* Metrics */}
              <div className="text-xs opacity-70 grid grid-cols-5 gap-x-2">
                {METRICS.map(m => (<span className="text-center text-xs" key={m}>{m.toUpperCase()}</span>))}
                {METRICS.map(metric =>
                  isEditing ? (
                    <NumberStepper
                      key={metric}
                      onChange={(val: number) => updateEditMetric(metric, val)}
                      value={editMetrics[metric]}
                      metricName={metric}
                    />
                  ) : (
                    <div key={metric} className="text-xs text-center">
                      {action[metric] ?? 0}
                    </div>
                  )
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}