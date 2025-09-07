'use client'

import { useEffect, useState } from 'react'
import { Store, useStore } from '@tanstack/react-store'
import { VersionGroupKey } from '@/lib/utils/pokeapi-helpers'

const versionGroupStore = new Store<{ versionGroup: VersionGroupKey }>({
  // Default value
  versionGroup: VersionGroupKey.ScarletViolet,
})

const setVersionGroup = (versionGroup: VersionGroupKey) => {
  versionGroupStore.setState(() => ({ versionGroup }))

  // Update localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('version_group', versionGroup)
  }
}

const isValidVersionGroupKey = (value: unknown): value is VersionGroupKey => {
  return Object.values(VersionGroupKey).includes(value as VersionGroupKey)
}

// Create selector hooks for components
export function useVersionGroup() {
  const versionGroup = useStore(
    versionGroupStore,
    (state) => state.versionGroup
  )
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem('version_group')
      if (storedValue && isValidVersionGroupKey(storedValue)) {
        // Only update if the stored value differs from current state
        if (versionGroup !== storedValue) {
          versionGroupStore.setState(() => ({
            versionGroup: storedValue as VersionGroupKey,
          }))
        }
      }
    }
  }, [versionGroup])

  return { versionGroup, setVersionGroup, hasMounted }
}
