"use client"

import { useEffect, useMemo, useState } from "react"

import LoadingSpinner from "@/app/components/LoadingSpinner"
import { Plus, Sliders } from "lucide-react"
import TagPill from "@/app/components/TagPill"

import { ActionDefinition, METRIC_KEYS, MetricKey } from "@/app/types"
import { toSentenceCase } from "@/app/lib/utils"
import { useApp } from "@/app/context/AppContext"
import Toast from "@/app/components/Toast"
import LogModal from "@/app/components/LogModal"

export default function Page() {
  const { actionDefinitions, loading, addAction } = useApp()
  const [search, setSearch] = useState("")
  const [filterMetrics, setFilterMetrics] = useState<MetricKey[]>([])
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [sortType, setSortType] = useState<string>("")
  const debouncedSearch = useDebounce(search, 250)
  
  const [toastVisible, setToastVisible] = useState(false)
  const [toastText, setToastText] = useState("")
  const [toastTimeout, setToastTimeout] = useState(2000)
  
  const [logModalShowing, setLogModalShowing] = useState(false)
  const [actionToAdvancedLog, setActionToAdvancedLog] = useState<ActionDefinition | null>(null)

  const [filteredActionDefinitions, setFilteredActionDefinitions] = useState<ActionDefinition[]>([])

  const showLogModal = (def: ActionDefinition) => {
    setActionToAdvancedLog(def)
    setLogModalShowing(true)
  }

  const toggleToast = (text: string) => {
    setToastText(text)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), toastTimeout)
  }

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

  const handleModalSubmit = (data: {
    id: number,
    timestamp: number,
    note: string,
  }) => {
    addAction(data.id, data.timestamp, data.note);
    setLogModalShowing(false)
    toggleToast("Action successfully logged!")
  };

  useEffect(() => {
    const term = debouncedSearch.trim().toLowerCase()
    console.log(`Checking...\nsearched: ${term},\ntags: ${filterTags}\nmetrics: ${filterMetrics}`)
    
    setFilteredActionDefinitions(
      actionDefinitions.filter(def => {
        // search
        const nameMatch = term ? def.name.toLowerCase().includes(term) : true

        // tag matching
        let tagMatch = true
        filterTags.forEach(t => { tagMatch = tagMatch && !def.tags.find(tag => tag.name == t) })

        // metric matching
        let metricMatch = true
        filterMetrics.forEach(metric => metricMatch = metricMatch && def[metric] !== null && def[metric] !== 0)
        // sort

        return nameMatch && tagMatch && metricMatch
      })
    )
  }, [actionDefinitions, debouncedSearch, filterMetrics, filterTags, sortType])

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <LogModal
        def={actionToAdvancedLog}
        isOpen={logModalShowing}
        onClose={() => setLogModalShowing(false)}
        onSubmit={handleModalSubmit} />
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
        {/* Metric Filtering */}
        <div className="w-full flex gap-x-2 items-center justify-between rounded-xl py-1 text-sm my-2">
          {METRIC_KEYS.map(k => (
            <button
              key={k}
              onClick={() => setFilterMetrics((prev) => prev.includes(k) ? prev.filter(m => m !== k) : [...prev, k])}
              className={`rounded-lg border border-${k} px-4 py-0.5 ${filterMetrics.includes(k) ? `bg-${k}/50` : `bg-${k}/10`}`}
            >{k}</button>
          ))}
        </div>
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
                    onClick={() => showLogModal(def)}
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
      <Toast show={toastVisible} text={toastText} duration={toastTimeout} />
    </div>
  )
}