"use client"

import { useState, useRef, useEffect } from "react"
import TagPill from "@/app/components/TagPill"
import { TAG_COLOR_CLASSES, TagColorKey } from "@/app/constants/Colors"
import { ChevronDown, Pencil, Plus, Save, SaveOff, Trash } from "lucide-react"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import BackLink from "@/app/components/BackLink"
import { useApp } from "@/app/context/AppContext"

type Tag = {
  id?: number
  name: string
  colorKey: TagColorKey
}

export default function Page() {
  const { tags, loading, addTag, updateTag, deleteTag } = useApp()

  // add tag form
  const [name, setName] = useState("")
  const [colorKey, setColorKey] = useState<TagColorKey>("red")

  // editing state
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")
  const [editColor, setEditColor] = useState<TagColorKey>("red")

  function handleAdd() {
    if(name.trim()) {
      addTag({name, colorKey})
      setName("")
      setColorKey("red")
    }
  }

  function startEdit(tag: Tag) {
    setEditingId(tag.id!)
    setEditName(tag.name)
    setEditColor(tag.colorKey)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName("")
  }

  async function saveEdit(id: number) {
    if (!editName.trim()) return
    updateTag({
      id,
      name: editName,
      colorKey: editColor
    })
    setEditingId(null)
  }

  if (loading) return (
    <div className="p-6">
      <LoadingSpinner />
    </div>
  )

  function ColorKeyDropdown({
    value,
    onChange,
  }: {
    value: TagColorKey
    onChange: (key: TagColorKey) => void
  }) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    // Close on outside click
    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener("mousedown", handler)
      return () => document.removeEventListener("mousedown", handler)
    }, [])

    return (
      <div ref={ref} className="relative w-fit flex">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          className="flex items-center gap-2 border rounded-lg px-2 py-1 bg-white"
        >
          <TagPill color={value} tag={value} />
          <ChevronDown
            size={14}
            className={`text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown */}
        <div
          className={`
            absolute z-50 left-0
            flex flex-col gap-1 p-1
            bg-white border rounded-lg shadow-md
            overflow-hidden
            transition-all duration-200 ease-in-out
            ${open ? "max-h-60 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
          `}
        >
          {Object.keys(TAG_COLOR_CLASSES).map((key) => (
            <button
              type="button"
              key={key}
              onClick={() => {
                onChange(key as TagColorKey)
                setOpen(false)
              }}
              className={`
                flex items-center px-2 py-1 rounded-md text-left
                hover:bg-gray-100 transition-colors
                ${value === key ? "bg-gray-100" : ""}
              `}
            >
              <TagPill color={key as TagColorKey} tag={key} />
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <BackLink />
      <h1 className="text-xl font-semibold mb-6">Edit Tags</h1>

      {/* Create */}
      <div className="flex gap-2 mb-6 w-full">
        <input
          className="border rounded-lg pl-3 py-2 flex-1 min-w-0"
          placeholder="Tag name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <ColorKeyDropdown value={colorKey} onChange={setColorKey} />

        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded-lg border-2"
        >
          <Plus />
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col">
        {tags.map((tag, i) => {
          const isEditing = editingId === tag.id

          return (
            <div
              key={tag.id}
              className={`flex items-center justify-between border-b-2 px-2 py-1 ${(i % 2 === 0) && !isEditing ? 'bg-gray-300' : 'bg-white'}`}
            >
              {/* Left side */}
              <div className="flex items-center">
                {isEditing ? (
                  <>
                    <input
                      className="bg-gray-100 px-2 py-1"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      autoFocus
                    />

                    <select
                      className="bg-grey-400 px-2 py-1"
                      value={editColor}
                      onChange={e =>
                        setEditColor(e.target.value as TagColorKey)
                      }
                    >
                      {Object.keys(TAG_COLOR_CLASSES).map(key => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <TagPill tag={tag.name} color={tag.colorKey} />
                )}
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => saveEdit(tag.id!)}
                      className="text-sm px-2 py-1 rounded bg-green-500 text-white"
                    >
                      <Save strokeWidth={1}/>
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-sm px-2 py-1 rounded bg-red-400"
                    >
                      <SaveOff />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(tag)}
                      className="text-sm px-2 py-1 rounded hover:bg-gray-100"
                      title="Edit"
                    >
                      <Pencil strokeWidth={2} color="black" size={20} />
                    </button>

                    <button
                      onClick={() => deleteTag(tag.id)}
                      className="text-sm px-2 py-1 rounded hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash strokeWidth={2} color="red"size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}