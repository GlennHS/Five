"use client"

import BackLink from "@/app/components/BackLink"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import { useToast } from "@/app/context/ToastContext"
import { Settings, settingsDefaults } from "@/app/lib/settings"
import { SettingsConfig } from "@/app/types"
import { BarChart, Radar } from "lucide-react"
import { useEffect, useState } from "react"

export default function Page() {
  const { showToast } = useToast()
  const [reload, setReload] = useState(false)
  const [settings, setSettings] = useState<SettingsConfig>(settingsDefaults)

  const handleChange = (sKey: keyof SettingsConfig, sVal: string) => {
    Settings.set(sKey, sVal)
    setSettings((prev) => {return {...prev, [sKey]: sVal}})
    showToast("Settings updated!", 2000)
  }

  useEffect(() => {
    if(reload) window.location.reload()
  }, [reload])

  useEffect(() => {
    setSettings(Settings.getAll())
  }, [])

  if(!settings) return (
    <LoadingSpinner />
  )

  return (
    <div className="p-6 max-w-xl mx-auto">
      <BackLink />
      <h1 className="text-xl font-semibold mb-6">Edit User Settings</h1>
      <h2>Graph Settings</h2>
      <div className="flex items-center gap-3">
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

      <button onClick={() => setReload(true)}>Discard Changes</button>
    </div>
  )
}