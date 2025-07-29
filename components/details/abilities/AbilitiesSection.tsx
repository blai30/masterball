import pMap from 'p-map'
import type { Ability, Pokemon } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import AbilityEntry, {
  type AbilityEntryProps,
} from '@/components/details/abilities/AbilityEntry'

export default async function AbilitiesSection({
  pokemon,
}: {
  pokemon: Pokemon
}) {
  const title = 'Abilities'
  const abilities = await pMap(
    pokemon.abilities.map((ability) => ability.ability.url),
    async (url) => {
      const resource = await pokeapi.getResource<Ability>(url)
      return resource
    },
    { concurrency: 20 }
  )

  const abilitiesMap: AbilityEntryProps[] = pokemon.abilities.map((ability) => {
    const resource = abilities.find((a) => a.name === ability.ability.name)!

    return {
      id: resource.id,
      name: ability.ability.name,
      slot: ability.slot,
      hidden: ability.is_hidden,
      resource,
    }
  })

  return (
    <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
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
