import { Type } from 'pokedex-promise-v2'

export function getTranslation<
  T extends {
    language: {
      name: string
    }
  },
  K extends keyof T,
>(resources: T[], field: K, language: string = 'en'): string {
  const resource =
    resources.find((r) => r.language.name === language) ??
    resources.find((r) => r.language.name === 'en')!

  return String(resource[field])
}

export enum DamageClassName {
  Physical = 'physical',
  Special = 'special',
  Status = 'status',
}

export enum TypeName {
  Normal = 'normal',
  Fighting = 'fighting',
  Flying = 'flying',
  Poison = 'poison',
  Ground = 'ground',
  Rock = 'rock',
  Bug = 'bug',
  Ghost = 'ghost',
  Steel = 'steel',
  Fire = 'fire',
  Water = 'water',
  Grass = 'grass',
  Electric = 'electric',
  Psychic = 'psychic',
  Ice = 'ice',
  Dragon = 'dragon',
  Dark = 'dark',
  Fairy = 'fairy',
}

export type TypeEffectiveness = Record<TypeName, number>

export function getEffectiveness(typeResources: Type[]): TypeEffectiveness {
  // Initialize all types with neutral effectiveness.
  const effectiveness = Object.fromEntries(
    Object.values(TypeName).map((type) => [type, 1])
  ) as TypeEffectiveness

  typeResources.forEach((type) => {
    // Process immunities first.
    type.damage_relations.no_damage_from.forEach((t) => {
      effectiveness[t.name as TypeName] = 0
    })

    // Process resistances (if not immune).
    type.damage_relations.half_damage_from.forEach((t) => {
      const typeName = t.name as TypeName
      if (effectiveness[typeName] !== 0) {
        effectiveness[typeName] *= 0.5
      }
    })

    // Process weaknesses (if not immune).
    type.damage_relations.double_damage_from.forEach((t) => {
      const typeName = t.name as TypeName
      if (effectiveness[typeName] !== 0) {
        effectiveness[typeName] *= 2
      }
    })
  })

  return effectiveness
}
