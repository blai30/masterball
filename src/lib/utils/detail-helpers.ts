import pMap from 'p-map'
import type { Ability, EvolutionChain, Pokemon, PokemonSpecies, Type } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import type { AbilityEntryProps } from '@/components/details/abilities/AbilityEntry'
import type { EvolutionNodeData } from '@/components/details/evolution/EvolutionSection'
import { TypeKey, getEffectiveness, type TypeRelation } from '@/lib/utils/pokeapi-helpers'
import { excludedVariants } from '@/lib/utils/excluded-slugs'

export async function buildTypeRelations(pokemon: Pokemon): Promise<TypeRelation[]> {
  const typeResources = await pMap(pokemon.types, (t) => pokeapi.getResource<Type>(t.type.url), {
    concurrency: 4,
  })

  const effectiveness = getEffectiveness(...typeResources)

  const allTypeResources = await pMap(
    Object.values(TypeKey),
    (typeName) => pokeapi.getByName<Type>('type', typeName),
    { concurrency: 10 }
  )

  return allTypeResources.map((type) => ({
    type,
    effectiveness: effectiveness[type.name as TypeKey],
  }))
}

export async function buildAbilitiesMap(pokemon: Pokemon): Promise<AbilityEntryProps[]> {
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

async function buildEvolutionNode(chain: any): Promise<EvolutionNodeData> {
  const species = await pokeapi.getByName<PokemonSpecies>('pokemon-species', chain.species.name)
  const defaultVariant = species.varieties
    .filter((v) => !excludedVariants.includes(v.pokemon.name))
    .find((v) => v.is_default)

  const pokemon = await pokeapi.getResource<Pokemon>(defaultVariant!.pokemon.url)

  const evolvesTo = await pMap(chain.evolves_to, (child: any) => buildEvolutionNode(child), {
    concurrency: 4,
  })

  return { species, pokemon, evolvesTo }
}

export async function buildEvolutionTree(species: PokemonSpecies): Promise<EvolutionNodeData> {
  const evolutionChain = await pokeapi.getResource<EvolutionChain>(species.evolution_chain.url)
  return buildEvolutionNode(evolutionChain.chain)
}
