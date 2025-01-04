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

// React hook, import this in your components to use.
export function useLanguage() {
  return useContext(LanguageContext)
}

// Context provider, import this in layout.tsx and wrap your app in it.
export function LanguageProvider({
  defaultLanguage = 'en',
  storageKey = 'lang',
  children,
}: Readonly<{
  defaultLanguage?: string
  storageKey?: string
  children: React.ReactNode
}>) {
  const [language, setLanguageState] = useState(defaultLanguage)

  // const router = useRouter()
  // const pathname = usePathname()
  // const searchParams = useSearchParams()
  // const language = searchParams.get(storageKey) ?? defaultLanguage

  // const createQueryString = useCallback(
  //   (name: string, value: string) => {
  //     const params = new URLSearchParams(searchParams.toString())
  //     params.set(name, value)
  //     return params.toString()
  //   },
  //   [searchParams]
  // )

  // Custom setter for state.
  const setLanguage = useCallback(
    (value: string) => {
      // const query = createQueryString(storageKey, value)
      // router.push([pathname, query].join('?'))
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
