'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from './ToastContext'

type Consent = {
  acceptedAnalytics: boolean | null
  loadingConsent: boolean
  updateConsent: (val: boolean) => void
}

const ConsentContext = createContext<Consent | null>(null)

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [acceptedAnalytics, setAcceptedAnalytics] = useState<boolean | null>(null)
  const [loadingConsent, setloadingConsent] = useState(true)

  const { showToast } = useToast()

  const updateConsent = (consent: boolean): void => {
    setAcceptedAnalytics(consent)
    showToast(consent ? 'Thank you for allowing analytics <3' : 'You have opted out of analytics.')
  }

  // hydrate from localStorage on mount
  useEffect(() => {
    const consent = window.localStorage.getItem('analytics-consent')
    if (consent !== null)
      setAcceptedAnalytics(consent === 'yes')
    setloadingConsent(false)
  }, [])

  // persist to localStorage when it changes
  useEffect(() => {
    if (acceptedAnalytics !== null)
      window.localStorage.setItem("analytics-consent", `${acceptedAnalytics ? 'yes' : 'no'}`)
  }, [acceptedAnalytics])

  return (
    <ConsentContext.Provider value={{ acceptedAnalytics, loadingConsent, updateConsent }}>
      {children}
    </ConsentContext.Provider>
  )
}

export function useConsent() {
  const ctx = useContext(ConsentContext)
  if (!ctx) throw new Error('useConsent must be used within ConsentProvider')
  return ctx
}