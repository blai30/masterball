'use client'

import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import Link from 'next/link'
import { EggGroup } from 'pokedex-promise-v2'

export default function EggGroupMetadata({
  eggGroups,
}: {
  eggGroups: EggGroup[]
}) {
  const title = 'Egg group'

  const eggGroupObjects = eggGroups.map((group) => {
    const groupName = getTranslation(group.names, 'name')
    return {
      id: group.id,
      key: group.name,
      name: groupName,
    }
  })

  return (
    <div className="flex flex-col gap-2 rounded-lg p-4">
      <h2 className="text-sm/6 text-zinc-600 dark:text-zinc-400">{title}</h2>
      <div className="flex flex-col">
        {eggGroupObjects.map((group) => (
          <Link
            key={group.key}
            href={`/egg-group/${group.key}`}
            className="text-base font-light text-blue-700 underline dark:text-blue-300"
          >
            {group.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
