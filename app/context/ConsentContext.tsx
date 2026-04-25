'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Consent = {
  acceptedAnalytics: boolean | null
  loadingConsent: boolean
  setAcceptedAnalytics: (val: boolean) => void
}

const ConsentContext = createContext<Consent | null>(null)

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [acceptedAnalytics, setAcceptedAnalytics] = useState<boolean | null>(null)
  const [loadingConsent, setloadingConsent] = useState(true)

  // hydrate from cookie on mount
  useEffect(() => {
    window.cookieStore.get('analytics-consent').then(cookie => {
      if (cookie && cookie?.value !== null)
        setAcceptedAnalytics(cookie.value === 'yes')
    }).then(() => setloadingConsent(false))
  }, [])

  // persist to cookie when it changes
  useEffect(() => {
    if (acceptedAnalytics !== null)
      window.cookieStore.set("analytics-consent", `${acceptedAnalytics ? 'yes' : 'no'}`)
  }, [acceptedAnalytics])

  return (
    <ConsentContext.Provider value={{ acceptedAnalytics, loadingConsent, setAcceptedAnalytics }}>
      {children}
    </ConsentContext.Provider>
  )
}

export function useConsent() {
  const ctx = useContext(ConsentContext)
  if (!ctx) throw new Error('useConsent must be used within ConsentProvider')
  return ctx
}