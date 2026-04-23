"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import Toast from "@/app/components/Toast"

type ToastContextType = {
  showToast: (text: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<{ text: string; duration: number }[]>([])
  const [current, setCurrent] = useState<{ text: string; duration: number } | null>(null)
  const [visible, setVisible] = useState(false)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const ANIMATION_DELAY = 300 // ms for toast to slide outta there

  const showToast = (text: string, duration = 5000) => {
    setQueue((q) => [...q, { text, duration }])
  }

  useEffect(() => {
    if (current) return
    if (queue.length === 0) return
    const next = queue[0]
    setCurrent(next)
    setQueue((q) => q.slice(1))
    setVisible(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setVisible(false)
      setTimeout(() => setCurrent(null), ANIMATION_DELAY)
    }, next.duration)
  }, [queue, current])

  const dismissToast = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setVisible(false)
    setTimeout(() => setCurrent(null), ANIMATION_DELAY)
    setQueue([])
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        show={visible}
        text={current?.text ?? ""}
        duration={current?.duration ?? 5000}
        onDismiss={dismissToast}
      />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}
