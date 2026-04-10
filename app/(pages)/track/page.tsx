"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import LoadingSpinner from "@/app/components/LoadingSpinner"
import { AArrowDown, AArrowUp, ClockArrowDown, ClockArrowUp, Plus, Search, Sliders } from "lucide-react"
import TagPill from "@/app/components/TagPill"

import { ActionDefinition, METRIC_KEYS, MetricKey, Tag } from "@/app/types"
import { toSentenceCase } from "@/app/lib/utils"
import { useApp } from "@/app/context/AppContext"
import Toast from "@/app/components/Toast"
import LogModal from "@/app/components/LogModal"
import { TAG_COLOR_CLASSES } from "@/app/fixtures/Colors"

export default function Page() {
  const { actions, actionDefinitions, tags, loading, addAction } = useApp()
  const [search, setSearch] = useState("")
  const searchBar = useRef<HTMLInputElement>(null)
  const [filterMetrics, setFilterMetrics] = useState<MetricKey[]>([])
  const [filterTags, setFilterTags] = useState<Tag[]>([])
  const [sortType, setSortType] = useState<string>("chrono")
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

  const lastUsedMap = useMemo(() => {
    const map = new Map<number, number>() // defId -> latest timestamp

    actions.forEach(a => {
      const current = map.get(a.actionId)
      if (!current || a.timestamp > current) {
        map.set(a.actionId, a.timestamp)
      }
    })

    return map
  }, [actions])

  useEffect(() => {
    const term = debouncedSearch.trim().toLowerCase()
    
    const filteredDefs = actionDefinitions.filter(def => {
      // search
      const nameMatch = term ? def.name.toLowerCase().includes(term) : true

      // tag matching
      let tagMatch = true
      filterTags.forEach(t => { tagMatch = tagMatch && def.tags.find(tag => tag === t) !== undefined })

      // metric matching
      let metricMatch = true
      filterMetrics.forEach(metric => metricMatch = metricMatch && def[metric] !== null && def[metric] !== 0)
      // sort

      return nameMatch && tagMatch && metricMatch
    })

    let sortedDefs = filteredDefs

    switch (sortType) {
      case 'alpha':
        sortedDefs = filteredDefs.sort((a,b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : a.name.toUpperCase() > b.name.toUpperCase() ? 1 : 0)
        break;
      case 'alpha-reverse':
        sortedDefs = filteredDefs.sort((a,b) => a.name.toUpperCase() < b.name.toUpperCase() ? 1 : a.name.toUpperCase() > b.name.toUpperCase() ? -1 : 0)
        break;
      case 'chrono':
        sortedDefs = [...filteredDefs].sort((a, b) => {
          const aTime = lastUsedMap.get(a.id) ?? 0
          const bTime = lastUsedMap.get(b.id) ?? 0
          return bTime - aTime // most recent first
        })
        break;

      case 'chrono-reverse':
        sortedDefs = [...filteredDefs].sort((a, b) => {
          const aTime = lastUsedMap.get(a.id) ?? 0
          const bTime = lastUsedMap.get(b.id) ?? 0
          return aTime - bTime
        })
        break;
      default:
        break;
    }

    setFilteredActionDefinitions(sortedDefs)

  }, [actions, actionDefinitions, debouncedSearch, filterMetrics, filterTags, sortType])

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
        <div className="w-full flex gap-2 items-center justify-center mb-4">
          <Search strokeWidth={2} size={32} onClick={() => searchBar.current && searchBar.current.focus()} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search actions..."
            className="border rounded w-full px-3 py-2"
            ref={searchBar}
          />
        </div>
        <span className="italic text-sm tracking-wide">Press a tag/metric to filter actions:</span>
        {/* Tag Filtering */}
        <div className="w-full flex flex-wrap gap-x-2 items-center justify-between rounded-xl pb-1 text-sm my-2">
          {tags.map(t => (
            <button
              key={t.id}
              onClick={() => setFilterTags((prev) => prev.includes(t) ? prev.filter(tag => tag !== t) : [...prev, t])}
              className={`rounded-lg border px-4 py-0.5 ${TAG_COLOR_CLASSES[t.colorKey]} ${filterTags.includes(t) ? "opacity-100" : "opacity-50"}`}
            >{t.name}</button>
          ))}
        </div>
        {/* Metric Filtering */}
        <div className="w-full flex gap-x-2 items-center justify-between rounded-xl py-1 text-sm my-2">
          {METRIC_KEYS.map(k => (
            <button
              key={k}
              onClick={() => setFilterMetrics((prev) => prev.includes(k) ? prev.filter(m => m !== k) : [...prev, k])}
              className={`rounded-lg bg-${k}/10 border border-${k} px-4 py-0.5 ${filterMetrics.includes(k) ? "opacity-100" : "opacity-50"}`}
            >{k}</button>
          ))}
        </div>
        {/* Order by Metric / Alpha [asc/desc] */}
        <div className="w-full flex items-center justify-end gap-x-4">
          <button
            className={`border-2 rounded-xl p-2 ${sortType === 'alpha' ? "opacity-100" : "opacity-50"}`}
            onClick={() => setSortType('alpha')}
          >
            <AArrowDown />
          </button>
          <button
            className={`border-2 rounded-xl p-2 ${sortType === 'alpha-reverse' ? "opacity-100" : "opacity-50"}`}
            onClick={() => setSortType('alpha-reverse')}
          >
            <AArrowUp />
          </button>
          <button
            className={`border-2 rounded-xl p-2 ${sortType === 'chrono' ? "opacity-100" : "opacity-50"}`}
            onClick={() => setSortType('chrono')}
          >
            <ClockArrowDown />
          </button>
          <button
            className={`border-2 rounded-xl p-2 ${sortType === 'chrono-reverse' ? "opacity-100" : "opacity-50"}`}
            onClick={() => setSortType('chrono-reverse')}
          >
            <ClockArrowUp />
          </button>
        </div>
      </div>

      <div className="flex flex-col mt-4">
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
                    onClick={() => {addAction(def.id); toggleToast("Action successfully logged!")}}
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