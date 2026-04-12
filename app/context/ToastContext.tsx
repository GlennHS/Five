"use client"

import { createContext, useContext, useState } from "react"
import Toast from "../components/Toast"

type ToastContextType = {
  showToast: (text: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  const [text, setText] = useState("")
  const [duration, setDuration] = useState(2000)

  const showToast = (msg: string, dur = 2000) => {
    setText(msg)
    setDuration(dur)
    setVisible(true)

    setTimeout(() => setVisible(false), dur)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast show={visible} text={text} duration={duration} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}