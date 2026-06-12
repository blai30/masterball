import { Store, useSelector } from '@tanstack/react-store'
import { useEffect, useState } from 'react'

import { VersionGroupKey } from '@/lib/utils/pokeapi-helpers'

const STORAGE_KEY = 'version_group'
const DEFAULT_VERSION_GROUP = VersionGroupKey.ScarletViolet

const isValidVersionGroupKey = (value: unknown): value is VersionGroupKey => {
  return Object.values(VersionGroupKey).includes(value as VersionGroupKey)
}

// The store initializes with default (the server cannot read localStorage).
// The persisted preference is applied once after hydration.
// Each interactive section is a separate React island that hydrates independently,
// so the applied value is also gated per component below: an island that hydrates after
// another has already updated the shared store still renders the default on its first pass,
// matching its pre-rendered HTML.
const versionGroupStore = new Store<{ versionGroup: VersionGroupKey }>({
  versionGroup: DEFAULT_VERSION_GROUP,
})

// Apply the persisted preference once.
// Runs once even though every consumer of the hook fires the effect.
let applied = false
function applyStoredVersionGroup() {
  if (applied || typeof window === 'undefined') return
  applied = true

  const stored = localStorage.getItem(STORAGE_KEY)
  if (isValidVersionGroupKey(stored)) {
    versionGroupStore.setState(() => ({ versionGroup: stored }))
  }
}

const setVersionGroup = (versionGroup: VersionGroupKey) => {
  if (typeof window === 'undefined') return

  versionGroupStore.setState(() => ({ versionGroup }))
  localStorage.setItem(STORAGE_KEY, versionGroup)
}

// Create selector hooks for components
export function useVersionGroup() {
  const versionGroup = useSelector(versionGroupStore, (state) => state.versionGroup)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    applyStoredVersionGroup()
    setIsHydrated(true)
  }, [])

  return {
    versionGroup: isHydrated ? versionGroup : DEFAULT_VERSION_GROUP,
    setVersionGroup,
  }
}
