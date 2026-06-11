import { Store, useSelector } from '@tanstack/react-store'

import { VersionGroupKey } from '@/lib/utils/pokeapi-helpers'

const STORAGE_KEY = 'version_group'

const isValidVersionGroupKey = (value: unknown): value is VersionGroupKey => {
  return Object.values(VersionGroupKey).includes(value as VersionGroupKey)
}

// Read the persisted preference at module load so the first client render uses it
// directly. On the server `window` is undefined, so SSR renders with the default
// version group, which is the correct pre-rendered content for crawlers and the
// default visitor.
function getInitialVersionGroup(): VersionGroupKey {
  if (typeof window === 'undefined') return VersionGroupKey.ScarletViolet
  const stored = localStorage.getItem(STORAGE_KEY)
  return isValidVersionGroupKey(stored) ? stored : VersionGroupKey.ScarletViolet
}

const versionGroupStore = new Store<{ versionGroup: VersionGroupKey }>({
  versionGroup: getInitialVersionGroup(),
})

const setVersionGroup = (versionGroup: VersionGroupKey) => {
  if (typeof window === 'undefined') return

  versionGroupStore.setState(() => ({ versionGroup }))
  localStorage.setItem(STORAGE_KEY, versionGroup)
}

// Create selector hooks for components
export function useVersionGroup() {
  const versionGroup = useSelector(versionGroupStore, (state) => state.versionGroup)
  return { versionGroup, setVersionGroup }
}
