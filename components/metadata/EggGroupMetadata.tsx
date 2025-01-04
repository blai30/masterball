'use client'

import Link from 'next/link'
import { EggGroup } from 'pokedex-promise-v2'
import { useLanguage } from '@/lib/LanguageContext'

export default function EggGroupMetadata({
  eggGroups,
}: {
  eggGroups: EggGroup[]
}) {
  const { language } = useLanguage()
  const title = 'Egg group'

  const eggGroupObjects = eggGroups.map((group) => {
    const groupName =
      group.names.find((name) => name.language.name === language) ??
      group.names.find((name) => name.language.name === 'en')!
    return {
      id: group.id,
      key: group.name,
      name: groupName.name,
    }
  })

  return (
    <div className="flex flex-col gap-2 rounded-lg p-4">
      <p className="text-sm/6 text-zinc-600 dark:text-zinc-400">{title}</p>
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
