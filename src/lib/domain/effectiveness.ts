import type { Type } from 'pokedex-promise-v2'

import pokeapi from '@/lib/api/pokeapi'
import { TYPE_KEYS, type TypeKey } from '@/lib/domain/types'

// The damage multipliers a type matchup can resolve to. Used for display bucketing.
export const EFFECTIVENESS = {
  immune: 0,
  quarter: 0.25,
  half: 0.5,
  neutral: 1,
  double: 2,
  quadruple: 4,
} as const

// Attacking type -> damage multiplier against the defender.
export type TypeEffectiveness = Record<TypeKey, number>

export type TypeRelation = {
  type: Type
  effectiveness: number
}

function getEffectiveness(...typeResources: Type[]): TypeEffectiveness {
  // Initialize all types with neutral effectiveness.
  const effectiveness = Object.fromEntries(TYPE_KEYS.map((type) => [type, 1])) as TypeEffectiveness

  typeResources.forEach((type) => {
    // Process immunities first.
    type.damage_relations.no_damage_from.forEach((t) => {
      effectiveness[t.name as TypeKey] = 0
    })

    // Process resistances (if not immune).
    type.damage_relations.half_damage_from.forEach((t) => {
      const typeName = t.name as TypeKey
      if (effectiveness[typeName] !== 0) {
        effectiveness[typeName] *= 0.5
      }
    })

    // Process weaknesses (if not immune).
    type.damage_relations.double_damage_from.forEach((t) => {
      const typeName = t.name as TypeKey
      if (effectiveness[typeName] !== 0) {
        effectiveness[typeName] *= 2
      }
    })
  })

  return effectiveness
}

// Pre-computed effectiveness for each single type and cached type resources.
// Fetched and computed once, reused across all ~1000+ detail pages.
const typeEffectiveness: Record<TypeKey, TypeEffectiveness> = {} as Record<
  TypeKey,
  TypeEffectiveness
>
let typesInitPromise: Promise<Record<TypeKey, Type>> | undefined

const initTypes = async (): Promise<Record<TypeKey, Type>> => {
  if (typesInitPromise) return typesInitPromise

  typesInitPromise = (async () => {
    const types = {} as Record<TypeKey, Type>
    await Promise.all(
      TYPE_KEYS.map(async (typeName) => {
        types[typeName] = await pokeapi.getByName<Type>('type', typeName)
      })
    )
    for (const [typeKey, typeResource] of Object.entries(types)) {
      typeEffectiveness[typeKey as TypeKey] = getEffectiveness(typeResource)
    }
    return types
  })()

  return typesInitPromise
}

function getCombinedEffectiveness(typeKeys: TypeKey[]): TypeEffectiveness {
  const base = Object.fromEntries(TYPE_KEYS.map((k) => [k, 1])) as TypeEffectiveness

  for (const typeKey of typeKeys) {
    const single = typeEffectiveness[typeKey]
    if (!single) continue
    for (const attackingType of TYPE_KEYS) {
      if (base[attackingType] !== 0) {
        base[attackingType] *= single[attackingType]
      }
    }
  }
  return base
}

// Type matchups for a monster, against every attacking type.
export async function getTypeRelations(typeKeys: TypeKey[]): Promise<TypeRelation[]> {
  const allTypes = await initTypes()
  const effectiveness = getCombinedEffectiveness(typeKeys)
  return TYPE_KEYS.map((typeKey) => ({
    type: allTypes[typeKey],
    effectiveness: effectiveness[typeKey],
  }))
}
