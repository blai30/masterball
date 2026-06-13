import { Sparkles } from 'lucide-react'

import type { AbilityEntryProps } from '@/lib/domain/abilities'
import { useVersionGroup } from '@/lib/stores/version-group'
import { getTranslation, resolveFlavorText } from '@/lib/utils/pokeapi-helpers'

export default function AbilityEntry({ props }: { props: AbilityEntryProps }) {
  const { versionGroup } = useVersionGroup()
  const name = getTranslation(props.resource.names, 'name')!

  const description =
    resolveFlavorText(props.resource.flavor_text_entries, versionGroup) ??
    getTranslation(props.resource.effect_entries, 'short_effect') ??
    ''

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
      <p className="text-base font-normal text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  )
}
