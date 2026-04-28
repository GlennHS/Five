"use client"

import BackLink from "@/app/components/BackLink"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import NumberStepper from "@/app/components/NumberStepper"
import SectionDivider from "@/app/components/SectionDivider"
import { useConsent } from "@/app/context/ConsentContext"
import { useToast } from "@/app/context/ToastContext"
import { useDebounce } from "@/app/hooks/useDebounce"
import { Settings, settingsDefaults } from "@/app/lib/settings"
import { FiveMetric, METRIC_KEYS, MetricKey, SettingsConfig } from "@/app/types"
import { BarChart, Check, Radar, X } from "lucide-react"
import { useEffect, useState } from "react"

const defaultDecay = {
  body: 0,
  mind: 0,
  cash: 0,
  work: 0,
  bond: 0,
}

export default function Page() {
  const { showToast } = useToast()
  const [settings, setSettings] = useState<SettingsConfig>(settingsDefaults)
  const [goalInput, setGoalInput] = useState(settings.goal)
  const [decay, setDecay] = useState<FiveMetric>(defaultDecay)
  const debouncedGoal = useDebounce(goalInput, 1000)
  const debouncedDecay = useDebounce(decay, 1000)

  const { acceptedAnalytics, updateConsent } = useConsent()

  const handleChange = (sKey: keyof SettingsConfig, sVal: string) => {
    Settings.set(sKey, sVal)
    setSettings((prev) => {return {...prev, [sKey]: sVal}})
    showToast("Settings updated!", 2000)
  }

  const updateMetricDecay = (m: MetricKey, v: number) => {
    setDecay(prev => ({
      ...prev,
      [m]: v
    }))
  }

  useEffect(() => {
    const all = Settings.getAll()
    setSettings(all)
    setGoalInput(all.goal)
    setDecay(all.decayRate ? JSON.parse(all.decayRate) : defaultDecay)
  }, [])

  useEffect(() => {
    if (debouncedGoal === settings.goal || debouncedGoal === undefined) return

    Settings.set("goal", debouncedGoal)
    setSettings(prev => ({ ...prev, goal: debouncedGoal }))
    showToast("Settings updated!", 2000)
  }, [debouncedGoal])

  useEffect(() => {
    const current = settings.decayRate
      ? JSON.parse(settings.decayRate)
      : defaultDecay

    // shallow compare to avoid unnecessary writes
    const isSame = JSON.stringify(current) === JSON.stringify(debouncedDecay)
    if (isSame) return

    Settings.set("decayRate", JSON.stringify(debouncedDecay))
    setSettings(prev => ({
      ...prev,
      decayRate: JSON.stringify(debouncedDecay)
    }))

    showToast("Settings updated!", 2000)
  }, [debouncedDecay])

  if(!settings) return (
    <LoadingSpinner />
  )

  return (
    <div className="py-6 px-2 max-w-xl mx-auto">
      <BackLink />
      <h1 className="text-xl font-semibold mt-4 mb-6 underline">Edit User Settings</h1>
      <SectionDivider text="Edit Graph Settings" />
      <div className="flex items-center justify-between w-full gap-3 text-sm">
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

      <div className="flex flex-col items-center justify-baseline gap-4">
        <div className="flex items-center justify-between w-full gap-3 text-sm">
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

        <div className="flex flex-col items-baseline justify-center w-full gap-3 text-sm bg-gray-100 p-4 rounded-lg">
          <span className="w-full italic text-center underline">Set your daily metric decay below</span>
          <div className="grid grid-cols-5 gap-x-2">
            {METRIC_KEYS.map(m => (<span className="text-center text-xs" key={m}>{m.toUpperCase()}</span>))}
            {METRIC_KEYS.map(metric => (
              <NumberStepper
                key={metric}
                onChange={(val: number) => updateMetricDecay(metric, val)}
                value={decay[metric]}
                max={10}
                min={0}
                metricName={metric}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}