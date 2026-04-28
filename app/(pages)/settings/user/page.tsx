"use client"

import BackLink from "@/app/components/BackLink"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import SectionDivider from "@/app/components/SectionDivider"
import { useConsent } from "@/app/context/ConsentContext"
import { useToast } from "@/app/context/ToastContext"
import { useDebounce } from "@/app/hooks/useDebounce"
import { Settings, settingsDefaults } from "@/app/lib/settings"
import { SettingsConfig } from "@/app/types"
import { BarChart, Check, Radar, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function Page() {
  const { showToast } = useToast()
  const [settings, setSettings] = useState<SettingsConfig>(settingsDefaults)
  const [goalInput, setGoalInput] = useState(settings.goal)
  const debouncedGoal = useDebounce(goalInput, 1000)

  const { acceptedAnalytics, updateConsent } = useConsent()

  const handleChange = (sKey: keyof SettingsConfig, sVal: string) => {
    Settings.set(sKey, sVal)
    setSettings((prev) => {return {...prev, [sKey]: sVal}})
    showToast("Settings updated!", 2000)
  }

  useEffect(() => {
    const all = Settings.getAll()
    setSettings(all)
    setGoalInput(all.goal)
  }, [])

  useEffect(() => {
    if (debouncedGoal === settings.goal || debouncedGoal === undefined) return

    Settings.set("goal", debouncedGoal)
    setSettings(prev => ({ ...prev, goal: debouncedGoal }))
    showToast("Settings updated!", 2000)
  }, [debouncedGoal])

  if(!settings) return (
    <LoadingSpinner />
  )

  return (
    <div className="p-6 max-w-xl mx-auto">
      <BackLink />
      <h1 className="text-xl font-semibold mt-4 mb-6 underline">Edit User Settings</h1>
      <SectionDivider text="Edit Graph Settings" />
      <div className="flex items-center gap-3 text-sm">
        <span>Choose your preferred chart type:</span>

        <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-300">
          <button
            onClick={() => handleChange("preferedChart", "radar")}
            className={`
              flex items-center justify-center px-3 py-1 rounded-lg transition
              ${settings.preferedChart === "radar"
                ? "bg-white shadow text-black"
                : "text-gray-500 hover:text-black"}
            `}
          >
            <Radar size={18} />
          </button>

          <button
            onClick={() => handleChange("preferedChart", "bar")}
            className={`
              flex items-center justify-center px-3 py-1 rounded-lg transition
              ${settings.preferedChart === "bar"
                ? "bg-white shadow text-black"
                : "text-gray-500 hover:text-black"}
            `}
          >
            <BarChart size={18} />
          </button>
        </div>
      </div>

      <SectionDivider text="App Settings" />

      <div className="flex flex-col items-center justify-baseline gap-2">
        <div className="flex items-center gap-3 text-sm">
          <span>Consent to anonymous analytics?</span>

          <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-300">
            <button
              onClick={() => updateConsent(true)}
              className={`
                flex items-center justify-center px-3 py-1 rounded-lg transition
                ${acceptedAnalytics === true
                  ? "bg-white shadow text-black"
                  : "text-gray-500 hover:text-black"}
              `}
            >
              <Check size={18} />
            </button>

            <button
              onClick={() => updateConsent(false)}
              className={`
                flex items-center justify-center px-3 py-1 rounded-lg transition
                ${acceptedAnalytics === false
                  ? "bg-white shadow text-black"
                  : "text-gray-500 hover:text-black"}
              `}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between w-full gap-3 text-sm">
          <span className="w-full">What's your goal for your metrics?</span>
          <input
            className="w-12 border py-0.5 rounded text-center"
            type="number"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}