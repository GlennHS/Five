"use client"

import { useEffect, useMemo, useState } from "react"

import DatePicker from "react-datepicker"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import { Plus, Sliders } from "lucide-react"
import TagPill from "@/app/components/TagPill"

import { ActionDefinition, METRIC_KEYS, MetricKey } from "@/app/types"
import { toSentenceCase } from "@/app/lib/utils"
import { useApp } from "@/app/context/AppContext"
import DefinitionCard from "@/app/components/DefinitionCard"
import Toast from "@/app/components/Toast"

export default function Page() {
  const { actionDefinitions, loading, addAction } = useApp()
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 250)

  const [toastVisible, setToastVisible] = useState(false)
  const [toastText, setToastText] = useState("")
  const [toastTimeout, setToastTimeout] = useState(2000)

  const [logModalShowing, setLogModalShowing] = useState(false)
  const [actionToAdvancedLog, setActionToAdvancedLog] = useState<ActionDefinition | null>(null)

  const showLogModal = (def: ActionDefinition) => {
    setActionToAdvancedLog(def)
    setLogModalShowing(true)
  }

  const toggleToast = (text: string) => {
    setToastText(text)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), toastTimeout)
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

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    const handleDateChange = (newDate: Date | null) => {
      if (newDate === null) return
      setChosenDate(newDate)
      setFormData({
        ...formData,
        timestamp: newDate.valueOf()
      })
    }

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      addAction(actionToAdvancedLog!.id, formData.timestamp, formData.note);
      onClose(); // close after submit
      toggleToast("Action successfully logged!")
    };

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-slide-up">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal / Bottom Sheet */}
        <div className={`relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-xl p-5 z-10 animate-slide-up ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          {/* Grab handle (mobile affordance) */}
          <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden" />

          <h2 className="text-lg font-semibold text-gray-800 m2-4">
            Log Action
          </h2>
          <DefinitionCard definition={actionToAdvancedLog!} className="mb-2 py-2" />

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Date / Time */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">
                When did this happen?
              </label>

              <DatePicker
                selected={chosenDate}
                onChange={(v: Date | null) => handleDateChange(v)}
                showTimeSelect
                dateFormat="d MMM yyyy, HH:mm"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                popperClassName="z-50"
                calendarClassName="rounded-xl shadow-lg border border-gray-200"
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">
                Notes (optional)
              </label>

              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                placeholder="Anything worth noting?"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium active:scale-[0.98] transition"
              >
                Save Action
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl text-gray-600 bg-gray-100 active:scale-[0.98] transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
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