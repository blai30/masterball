'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

const LanguageContext = createContext({
  language: 'en',
  setLanguage: (language: string) => {},
})

// Helper function for useState default value.
const getLanguage = (storageKey: string) => {
  if (typeof window === 'undefined') {
    return undefined
  }

  let initialLanguage
  try {
    initialLanguage = localStorage.getItem(storageKey) || undefined
  } catch (e) {
    // Server cannot access localStorage, only need it on client.
  }

  return initialLanguage
}

// React hook, import this in your components to use.
export function useLanguage() {
  return useContext(LanguageContext)
}

// Context provider, import this in layout.tsx and wrap your app in it.
export function LanguageProvider({
  defaultLanguage = 'en',
  storageKey = 'language',
  children,
}: Readonly<{
  defaultLanguage?: string
  storageKey?: string
  children: React.ReactNode
}>) {
  const [language, setLanguageState] = useState(defaultLanguage)

  // Custom setter for state.
  const setLanguage = useCallback(
    (value: string) => {
      setLanguageState(value)
      try {
        localStorage.setItem(storageKey, value)
      } catch (e) {
        // Server cannot access localStorage, only need it on client.
      }
    },
    [storageKey]
  )

  useEffect(() => {
    const initialLanguage = getLanguage(storageKey) ?? defaultLanguage
    setLanguageState(initialLanguage)
  }, [defaultLanguage, storageKey])

  const value = { language, setLanguage }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
