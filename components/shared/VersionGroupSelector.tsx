'use client'

import { memo } from 'react'
import { ChevronDown } from 'lucide-react'
import { VersionGroupKey, VersionGroupLabels } from '@/lib/utils/pokeapiHelpers'
import { useVersionGroup } from '@/lib/stores/version-group'

function VersionGroupSelector() {
  const { versionGroup, setVersionGroup } = useVersionGroup()

  return (
    <div className="relative flex w-full items-center justify-center text-sm/6">
      <label htmlFor="version-group" className="sr-only">
        Version Group selector
      </label>
      <select
        id="version-group"
        name="version-group"
        aria-label="Version Group selector"
        value={versionGroup}
        onChange={(e) => setVersionGroup(e.target.value as VersionGroupKey)}
        className="w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 inset-ring-1 inset-ring-zinc-300 focus:inset-ring-zinc-500 focus:outline-none md:w-40 dark:bg-black dark:text-zinc-200 dark:inset-ring-zinc-700 dark:focus:inset-ring-zinc-500"
      >
        {Object.entries(VersionGroupLabels).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-2 h-[1lh] w-4 text-zinc-600 dark:text-zinc-400"
      />
    </div>
  )
}

export default memo(VersionGroupSelector)
