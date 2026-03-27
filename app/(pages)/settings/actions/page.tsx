"use client"

import { useEffect, useState } from "react"
import { ActionDefinitionController } from "@/app/controllers/ActionDefinitionController"
import { TagController } from "@/app/controllers/TagController"
import TagPill from "@/app/components/TagPill"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import { Pencil, Plus, Save, SaveOff, Trash } from "lucide-react"
import { TagDB, ActionDefinitionDB } from "@/app/types"
import BackLink from "@/app/components/BackLink"
import { NumberStepper } from "@/app/components/NumberStepper"

type MetricKey = "mind" | "body" | "work" | "cash" | "bond"

const METRICS: MetricKey[] = ["mind", "body", "work", "cash", "bond"]

export default function Page() {
  const [tags, setTags] = useState<TagDB[]>([])
  const [actions, setActions] = useState<ActionDefinitionDB[]>([])
  const [loading, setLoading] = useState(true)

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

  function startEdit(action: ActionDefinitionDB) {
    setEditingId(action.id!)
    setEditName(action.name)
    setEditTagIds(action.tagIds)
    setEditMetrics({
      mind: action.mind,
      body: action.body,
      work: action.work,
      cash: action.cash,
      bond: action.bond
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
    ...editMetrics
  }

  await ActionDefinitionController.update(updated)

  setActions(prev =>
    prev.map(a => (a.id === id ? updated : a))
  )

  setEditingId(null)
}

  function cancelEdit() {
    setEditingId(null)
    setEditName("")
  }

  useEffect(() => {
    async function load() {
      const [tags, actions] = await Promise.all([
        TagController.getAll(),
        ActionDefinitionController.getAll()
      ])

      setTags(tags)
      setActions(actions)
      setLoading(false)
    }

    load()
  }, [])

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
      ...metrics
    }

    const id = await ActionDefinitionController.create(newDef)

    setActions(prev => [...prev, { id, ...newDef }])

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

    await ActionDefinitionController.delete(id)
    setActions(prev => prev.filter(a => a.id !== id))
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
      <h1 className="text-xl font-semibold mb-6">Edit Actions</h1>

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
            <input
              key={metric}
              type="number"
              className={`border rounded px-2 py-1 text-sm bg-${metric}/25`}
              value={metrics[metric]}
              onChange={e => updateMetric(metric, Number(e.target.value))}
              placeholder={metric}
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
        {actions.map((action, i) => {
          const actionTags = action.tagIds
            .map(id => tags.find(t => t.id === id))
            .filter(Boolean) as TagDB[]
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
                  <div className="font-medium">{action.name}</div>
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
                    <button
                      onClick={() => startEdit(action)}
                      className="hover:bg-red-100 rounded p-1"
                    >
                      <Pencil size={18} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => handleDelete(action.id)}
                      className="hover:bg-red-100 rounded p-1"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                )}
               </div>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                {(isEditing ? tags : actionTags).map(tag => {
                  const selected = isEditing
                    ? editTagIds.includes(tag.id!)
                    : action.tagIds.includes(tag.id!)

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
                    // <input
                    //   key={metric}
                    //   type="number"
                    //   className={`border rounded px-2 py-1 text-sm text-center bg-${metric}/25`}
                    //   value={editMetrics[metric]}
                    //   onChange={e =>
                    //     updateEditMetric(metric, Number(e.target.value))
                    //   }
                    // />
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