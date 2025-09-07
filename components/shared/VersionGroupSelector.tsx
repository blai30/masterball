'use client'

import { memo } from 'react'
import {
  VersionGroupKey,
  VersionGroupLabels,
} from '@/lib/utils/pokeapi-helpers'
import { useVersionGroup } from '@/lib/stores/version-group'
import {
  Listbox,
  ListboxLabel,
  ListboxOption,
} from '@/components/ui/catalyst/listbox'

function VersionGroupSelector() {
  const { versionGroup, setVersionGroup, hasMounted } = useVersionGroup()

  if (!hasMounted) return null

  const options = Object.entries(VersionGroupLabels).map(([key, label]) => ({
    value: key as VersionGroupKey,
    label,
  }))

  return (
    <Listbox
      name="version-group"
      defaultValue={versionGroup}
      value={versionGroup}
      onChange={setVersionGroup}
      className="min-w-52 lg:max-w-40"
    >
      {options.map((option) => {
        return (
          <ListboxOption key={option.value} value={option.value}>
            <ListboxLabel>{option.label}</ListboxLabel>
          </ListboxOption>
        )
      })}
    </Listbox>
  )
}

export default memo(VersionGroupSelector)
