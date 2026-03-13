import type { Ability } from 'pokedex-promise-v2'
import AbilityEntry, {
  type AbilityEntryProps,
} from '@/components/details/abilities/AbilityEntry'

export type AbilitySectionData = {
  id: number
  name: string
  slot: number
  hidden: boolean
  resource: Ability
}

export default function AbilitiesSection({
  abilities,
}: {
  abilities: AbilitySectionData[]
}) {
  const title = 'Abilities'

  return (
    <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">{title}</h2>
      <ul className="flex flex-col gap-4">
        {abilities.map((ability) => (
          <li key={ability.id}>
            <AbilityEntry props={ability} />
          </li>
        ))}
      </ul>
    </section>
  )
}
