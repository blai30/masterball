import Link from 'next/link'
import { EggGroup } from 'pokedex-promise-v2'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

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
    <div className="flex flex-col gap-2 rounded-lg">
      <h2 className="text-sm/6 text-zinc-600 dark:text-zinc-400">{title}</h2>
      <ul className="flex flex-col">
        {eggGroupObjects.map((group) => (
          <li key={group.key} className="inline-block">
            <Link
              href={`/egg-group/${group.key}`}
              className="font-medium text-blue-700 underline underline-offset-4 transition-colors hover:text-blue-800 hover:duration-0 dark:text-blue-300 dark:hover:text-blue-200"
            >
              {group.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
