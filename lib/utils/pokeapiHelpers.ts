import { Type } from 'pokedex-promise-v2'

interface BaseTranslatable {
  language: {
    name: string
  }
}

export function getTranslation<T extends BaseTranslatable, K extends keyof T>(
  resources: T[],
  field: K,
  language: string,
  fallbackLanguage: string = 'en'
): string {
  const resource =
    resources.find((r) => r.language.name === language) ??
    resources.find((r) => r.language.name === fallbackLanguage)!

  return String(resource[field])
}

export const ALL_TYPES = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
] as const

export type PokemonType = (typeof ALL_TYPES)[number]
export type TypeEffectiveness = Record<PokemonType, number>

export function calculateTypeEffectiveness(
  typeResources: Type[]
): TypeEffectiveness {
  // Initialize all types with neutral effectiveness.
  const effectiveness = Object.fromEntries(
    ALL_TYPES.map((type) => [type, 1])
  ) as TypeEffectiveness

  typeResources.forEach((type) => {
    // Process immunities first.
    type.damage_relations.no_damage_from.forEach((t) => {
      effectiveness[t.name as PokemonType] = 0
    })

    // Process resistances (if not immune).
    type.damage_relations.half_damage_from.forEach((t) => {
      const typeName = t.name as PokemonType
      if (effectiveness[typeName] !== 0) {
        effectiveness[typeName] *= 0.5
      }
    })

    // Process weaknesses (if not immune).
    type.damage_relations.double_damage_from.forEach((t) => {
      const typeName = t.name as PokemonType
      if (effectiveness[typeName] !== 0) {
        effectiveness[typeName] *= 2
      }
    })
  })

  return effectiveness
}
