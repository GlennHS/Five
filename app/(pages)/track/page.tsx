"use client"

import { useEffect, useMemo, useState } from "react"
import Flatpickr from "react-flatpickr";
import TagPill from "@/app/components/TagPill"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import { ActionDefinition, METRIC_KEYS, MetricKey } from "@/app/types"
import { toSentenceCase } from "@/app/lib/utils"
import { useApp } from "@/app/context/AppContext"
import { Plus, Sliders } from "lucide-react"

export default function Page() {
  const { actionDefinitions, loading, addAction } = useApp()
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 250)

  const [logModalShowing, setLogModalShowing] = useState(false)
  const [actionId, setActionId] = useState(-1)

  const showLogModal = (id: number) => {
    setActionId(id)
    setLogModalShowing(true)
  }

  const filteredActionDefinitions = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase()

    if (!term) return actionDefinitions

    return actionDefinitions.filter(def => {
      const nameMatch = def.name.toLowerCase().includes(term)

      const tagMatch = def.tags.some(tag =>
        tag.name.toLowerCase().includes(term)
      )

      return nameMatch || tagMatch
    })
  }, [actionDefinitions, debouncedSearch])

  const getBGString = (key: MetricKey, def: ActionDefinition): string => {
    if (def[key] && def[key] !== 0)
      return `bg-${key}/50`
    else
      return `bg-${key}/10`
  }

  function useDebounce<T>(value: T, delay = 300) {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
      const id = setTimeout(() => setDebounced(value), delay)
      return () => clearTimeout(id)
    }, [value, delay])

    return debounced
  }

  function LogModal({
    isOpen,
    onClose,
    onSubmit
  } : {
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (data: {id: number, timestamp: number, note: string}) => void
  }) {
    const [formData, setFormData] = useState({
      id: -1,
      timestamp: Date.now(),
      note: "",
    });

    const [chosenDate, setChosenDate] = useState<Date>(new Date())

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    const handleDateChange = (newDate: Date) => {
      setChosenDate(newDate)
      setFormData({
        ...formData,
        timestamp: newDate.valueOf()
      })
    }

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      addAction(formData.id, formData.timestamp, formData.note);
      onClose(); // close after submit
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md p-6 z-10">
          <h2 className="text-xl font-semibold mb-4">Log an Action</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="hidden"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <Flatpickr
              value={chosenDate}
              onChange={(v: Date[]) => handleDateChange(v[0])}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
      <LogModal isOpen={logModalShowing} onClose={() => setLogModalShowing(false)} onSubmit={(data) => { addAction(data.id, data.timestamp, data.note); setLogModalShowing(false)}} />
      <h1 className="text-xl font-semibold mb-6">Track Actions</h1>

      <div>
        {/* Search Bar */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search actions..."
          className="border px-3 py-2 rounded w-full mb-4"
        />
        {/* Tag Filtering */}
        {/* Order by Metric / Alpha [asc/desc] */}
      </div>

      <div className="flex flex-col">
        {filteredActionDefinitions.map((def, i) => {
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
                <div className="rounded-2xl border-2 border-black flex flex-center overflow-hidden">
                  <button
                    onClick={() => showLogModal(def.id)}
                    className="px-3 py-1 bg-gray-400 text-white text-sm border-r border-gray-700 active:bg-gray-600"
                  >
                    <Sliders />
                  </button>
                  <button
                    onClick={() => addAction(def.id)}
                    className="px-3 py-1 bg-gray-400 text-white text-sm border-r border-gray-700 active:bg-gray-600"
                  >
                    <Plus />
                  </button>
                </div>
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