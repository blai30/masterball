'use client'

import { memo } from 'react'
import { VersionGroupKey, VersionGroupLabels } from '@/lib/utils/pokeapiHelpers'
import { useVersionGroup } from '@/lib/stores/version-group'
import { Listbox, ListboxLabel, ListboxOption } from '@/components/ui/listbox'

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
      className="lg:max-w-40 min-w-52"
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
