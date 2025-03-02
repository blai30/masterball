'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { VersionGroupKey } from '@/lib/utils/pokeapiHelpers'

const VersionGroupContext = createContext({
  versionGroup: VersionGroupKey.ScarletViolet as VersionGroupKey,
  setVersionGroup: (versionGroup: VersionGroupKey) => {},
})

export function useVersionGroup() {
  return useContext(VersionGroupContext)
}

// Helper function for useState default value.
const getVersionGroup = (storageKey: string) => {
  if (typeof window === 'undefined') {
    return undefined
  }

  const initialVersionGroup = localStorage.getItem(storageKey) || undefined
  return initialVersionGroup
}

export function VersionGroupProvider({
  defaultVersionGroup = VersionGroupKey.ScarletViolet,
  storageKey = 'version_group',
  children,
}: {
  defaultVersionGroup?: VersionGroupKey
  storageKey?: string
  children: React.ReactNode
}) {
  const [versionGroup, setVersionGroup] = useState(defaultVersionGroup)

  const customSetter = useCallback(
    (versionGroup: VersionGroupKey) => {
      setVersionGroup(versionGroup)
      localStorage.setItem(storageKey, versionGroup)
    },
    [storageKey]
  )

  useEffect(() => {
    const initialVersionGroup =
      getVersionGroup(storageKey) ?? defaultVersionGroup
    setVersionGroup(initialVersionGroup as VersionGroupKey)
  }, [defaultVersionGroup, storageKey])

  const value = { versionGroup, setVersionGroup: customSetter }

  return (
    <VersionGroupContext.Provider value={value}>
      {children}
    </VersionGroupContext.Provider>
  )
}
