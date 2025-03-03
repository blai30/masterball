'use client'

import { VersionGroupKey, VersionGroupLabels } from '@/lib/utils/pokeapiHelpers'
import { useVersionGroup } from '@/components/shared/VersionGroupProvider'

export default function VersionGroupSelector() {
  const { versionGroup, setVersionGroup } = useVersionGroup()
  const options = Object.entries(VersionGroupLabels)
    .filter(([key]) => key !== 'all')
    .map(([key, label]) => ({ key, label }))

  return (
    <select
      value={versionGroup}
      onChange={(e) => setVersionGroup(e.target.value as VersionGroupKey)}
      className="rounded-md bg-white p-2 text-sm inset-ring-1 inset-ring-zinc-300 focus:inset-ring-zinc-500 focus:outline-none dark:bg-black dark:text-zinc-200 dark:inset-ring-zinc-700 dark:focus:inset-ring-zinc-500"
    >
      {options.map(({ key, label }) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  )
}
