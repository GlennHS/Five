import { useState } from "react"
import { ActionDefinition } from "../types"
import { useToast } from "../context/ToastContext"

export function useTracking(addAction: Function) {
  const { showToast } = useToast()

  const [logModalShowing, setLogModalShowing] = useState(false)
  const [actionToAdvancedLog, setActionToAdvancedLog] = useState<ActionDefinition | null>(null)

  const handleQuickLog = (def: ActionDefinition) => {
    addAction(def.id)
    showToast("Action successfully logged!")
  }

  const handleAdvancedLog = (def: ActionDefinition) => {
    setActionToAdvancedLog(def)
    setLogModalShowing(true)
  }

  const handleModalSubmit = (data: {
    id: number
    timestamp: number
    note: string
  }) => {
    addAction(data.id, data.timestamp, data.note)
    setLogModalShowing(false)
    showToast("Action successfully logged!")
  }

  return {
    modal: { logModalShowing, actionToAdvancedLog },
    trackingMethods: { handleQuickLog, handleAdvancedLog, handleModalSubmit, setLogModalShowing }
  }
}