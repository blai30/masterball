import pMap from 'p-map'
import type { Ability, Pokemon } from 'pokedex-promise-v2'

import pokeapi from '@/lib/api/pokeapi'

export type AbilityEntryProps = {
  id: number
  name: string
  slot: number
  hidden: boolean
  resource: Ability
}

export function buildAbilitiesMap(pokemon: Pokemon): Promise<AbilityEntryProps[]> {
  return pMap(
    pokemon.abilities,
    async (entry) => {
      const resource = await pokeapi.getResource<Ability>(entry.ability.url)
      return {
        id: resource.id,
        name: resource.name,
        slot: entry.slot,
        hidden: entry.is_hidden,
        resource,
      } satisfies AbilityEntryProps
    },
    { concurrency: 6 }
  )
}
