import { memo } from 'react'

import { Listbox, ListboxLabel, ListboxOption } from '@/components/ui/catalyst/listbox'
import { VERSION_GROUPS, type VersionGroupKey } from '@/lib/domain/version-groups'
import { useVersionGroup } from '@/lib/stores/version-group'

function VersionGroupSelector() {
  const { versionGroup, setVersionGroup } = useVersionGroup()

  const options = Object.entries(VERSION_GROUPS).map(([key, label]) => ({
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
