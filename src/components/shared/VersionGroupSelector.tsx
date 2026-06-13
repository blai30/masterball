import { memo } from 'react'

import { Select, type SelectItem } from '@/components/ui/Select'
import { VERSION_GROUPS, type VersionGroupKey } from '@/lib/domain/version-groups'
import { useVersionGroup } from '@/lib/stores/version-group'

function VersionGroupSelector() {
  const { versionGroup, setVersionGroup } = useVersionGroup()

  const items: SelectItem<VersionGroupKey>[] = Object.entries(VERSION_GROUPS).map(
    ([key, label]) => ({ value: key as VersionGroupKey, label })
  )

  return (
    <Select
      name="version-group"
      value={versionGroup}
      onValueChange={setVersionGroup}
      items={items}
      className="min-w-52 lg:max-w-40"
    />
  )
}

export default memo(VersionGroupSelector)
