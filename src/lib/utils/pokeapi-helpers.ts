import pMap from 'p-map'
import type { Pokemon, PokemonForm, PokemonSpecies } from 'pokedex-promise-v2'

import pokeapi from '@/lib/api/pokeapi'
import type { TypeKey } from '@/lib/domain/types'
import type { VersionGroupKey } from '@/lib/domain/version-groups'
import type { EvolutionConditionView } from '@/lib/utils/evolution-conditions'
import { excludedVariants } from '@/lib/utils/excluded-slugs'

export function getTranslation<
  T extends {
    language: {
      name: string
    }
  },
  K extends keyof T,
>(resources: T[] | undefined, field: K, language: string = 'en') {
  if (!resources) return undefined
  const resource =
    resources?.find((r) => r.language.name === language) ??
    resources?.find((r) => r.language.name === 'en')

  if (!resource) return undefined
  return String(resource[field])
}

export type Monster = {
  id: number
  key: string
  name: string
  speciesSlug: string
  pokemonSlug?: string | undefined
  formSlug?: string | undefined
  types?: TypeKey[] | undefined
  imageUrl?: string | undefined
}

export type EvolutionNodeData = {
  species: PokemonSpecies
  pokemon: Pokemon
  conditions: EvolutionConditionView[]
  evolvesTo: EvolutionNodeData[]
}

export const createMonster = async (
  variant: Pokemon,
  species: PokemonSpecies
): Promise<Monster> => {
  const form =
    variant.is_default || species.name === variant.name
      ? undefined
      : await pokeapi.getByName<PokemonForm>('pokemon-form', variant.name).catch(() => undefined)

  const name =
    getTranslation(form?.form_names, 'name') ??
    getTranslation(form?.names, 'name') ??
    getTranslation(species.names, 'name')!

  const imageId = species.id.toString().padStart(4, '0')

  return {
    id: species.id,
    key: variant.name,
    name,
    speciesSlug: species.name,
    pokemonSlug: variant.name ?? undefined,
    formSlug: form?.name ?? undefined,
    types: variant.types.map((t) => t.type.name as TypeKey) ?? undefined,
    imageUrl: variant.is_default
      ? `https://raw.githubusercontent.com/blai30/PokemonSpritesDump/refs/heads/main/sprites/sprite_${imageId}_s0.webp`
      : `https://raw.githubusercontent.com/blai30/PokemonSpritesDump/refs/heads/main/sprites/sprite_${imageId}_${variant.name}_s0.webp`,
  } as Monster
}

export const getMonstersBySpecies = async (species: PokemonSpecies): Promise<Monster[]> => {
  // Hard-code exceptions to filter out useless variants.
  const filteredVariants = species.varieties.filter(
    (variant) => !excludedVariants.includes(variant.pokemon.name)
  )

  const variants: Pokemon[] = await pMap(
    filteredVariants.map((variant) => variant.pokemon.url),
    async (url) => {
      const resource = await pokeapi.getResource<Pokemon>(url)
      return resource
    },
    { concurrency: 10 }
  )

  const monsters = await pMap(
    variants,
    async (variant) => {
      const resource = createMonster(variant, species)
      return resource
    },
    { concurrency: 10 }
  )
  return monsters
}

export type LocationEncounterRow = {
  locationAreaSlug: string
  locationName: string
  versionName: string
  versionGroup: VersionGroupKey
  maxChance: number
  minLevel: number
  maxLevel: number
  methods: string[]
}
