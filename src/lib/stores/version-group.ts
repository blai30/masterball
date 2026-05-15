import { Store, useSelector } from '@tanstack/react-store'
import { useEffect, useState } from 'react'

import { VersionGroupKey } from '@/lib/utils/pokeapi-helpers'

const versionGroupStore = new Store<{ versionGroup: VersionGroupKey }>({
  // Default value
  versionGroup: VersionGroupKey.ScarletViolet,
})

const setVersionGroup = (versionGroup: VersionGroupKey) => {
  if (typeof window === 'undefined') return

  versionGroupStore.setState(() => ({ versionGroup }))
  localStorage.setItem('version_group', versionGroup)
}

const isValidVersionGroupKey = (value: unknown): value is VersionGroupKey => {
  return Object.values(VersionGroupKey).includes(value as VersionGroupKey)
}

// Create selector hooks for components
export function useVersionGroup() {
  const [hasMounted, setHasMounted] = useState(false)
  const versionGroup = useSelector(versionGroupStore, (state) => state.versionGroup)

  useEffect(() => {
    if (typeof window === 'undefined') return

    setHasMounted(true)
    const storedValue = localStorage.getItem('version_group')
    if (storedValue && isValidVersionGroupKey(storedValue)) {
      // Only update if the stored value differs from current state
      if (versionGroup !== storedValue) {
        versionGroupStore.setState(() => ({
          versionGroup: storedValue as VersionGroupKey,
        }))
      }
    }
  }, [versionGroup])

  return { versionGroup, setVersionGroup, hasMounted }
}
