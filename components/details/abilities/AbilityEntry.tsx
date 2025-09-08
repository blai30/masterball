'use client'

import type { Ability } from 'pokedex-promise-v2'
import { Sparkles } from 'lucide-react'
import { getTranslation } from '@/lib/utils/pokeapi-helpers'
import { useVersionGroup } from '@/lib/stores/version-group'

export type AbilityEntryProps = {
  id: number
  name: string
  slot: number
  hidden: boolean
  resource: Ability
}

export default function AbilityEntry({ props }: { props: AbilityEntryProps }) {
  const { versionGroup, hasMounted } = useVersionGroup()
  const name = getTranslation(props.resource.names, 'name')!
  if (!hasMounted) return null

  const description = (() => {
    const defaultDescription =
      getTranslation(props.resource.effect_entries, 'short_effect') ?? ''
    const entry = props.resource.flavor_text_entries.find(
      (entry) =>
        entry.language.name === 'en' &&
        entry.version_group?.name === versionGroup
    )
    if (!entry) return defaultDescription
    if ('text' in entry) return entry.text
    if ('flavor_text' in entry) return entry.flavor_text

    return defaultDescription
  })()

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row items-center gap-2">
        <h3
          title={`${props.hidden ? 'Hidden ability' : `Ability ${props.slot}`}: ${name}`}
          className="text-lg font-medium text-black dark:text-white"
        >
          {name}
        </h3>
        {props.hidden && (
          <span title="Hidden ability">
            <Sparkles size={16} className="text-zinc-800 dark:text-zinc-200" />
          </span>
        )}
      </div>
      <p className="text-base font-normal text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </div>
  )
}
