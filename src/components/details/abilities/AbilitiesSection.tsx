import type { AbilityEntryProps } from '@/components/details/abilities/AbilityEntry'
import AbilityEntry from '@/components/details/abilities/AbilityEntry'

export default function AbilitiesSection({ abilitiesMap }: { abilitiesMap: AbilityEntryProps[] }) {
  const title = 'Abilities'

  return (
    <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">{title}</h2>
      <ul className="flex flex-col gap-4">
        {abilitiesMap.map((ability) => {
          return (
            <li key={ability.id}>
              <AbilityEntry props={ability} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
