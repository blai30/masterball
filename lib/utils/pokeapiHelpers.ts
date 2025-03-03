import { pokeapi } from '@/lib/providers'
import { Pokemon, PokemonForm, PokemonSpecies, Type } from 'pokedex-promise-v2'

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
  species: PokemonSpecies
  pokemon: Pokemon
  form?: PokemonForm | undefined
}

export const createMonster = async (
  variant: Pokemon,
  species: PokemonSpecies
): Promise<Monster> => {
  const form = await pokeapi
    .getPokemonFormByName(variant.name)
    .catch(() => undefined)

  const name =
    getTranslation(form?.form_names, 'name') ??
    getTranslation(form?.names, 'name') ??
    getTranslation(species.names, 'name')!

  return {
    id: species.id,
    key: variant.name,
    name,
    species: species,
    pokemon: variant,
    form: variant.is_default ? undefined : form,
  } as Monster
}

export const getMonstersBySpecies = async (
  species: PokemonSpecies
): Promise<Monster[]> => {
  const variants: Pokemon[] = await pokeapi.getResource(
    species.varieties.map((v) => v.pokemon.url)
  )

  return Promise.all(variants.map((variant) => createMonster(variant, species)))
}

export enum StatKey {
  Hp = 'hp',
  Attack = 'attack',
  Defense = 'defense',
  SpecialAttack = 'special-attack',
  SpecialDefense = 'special-defense',
  Speed = 'speed',
}

export const StatLabels: Record<StatKey, string> = {
  [StatKey.Hp]: 'HP',
  [StatKey.Attack]: 'Attack',
  [StatKey.Defense]: 'Defense',
  [StatKey.SpecialAttack]: 'Sp. Atk',
  [StatKey.SpecialDefense]: 'Sp. Def',
  [StatKey.Speed]: 'Speed',
}

export enum DamageClassKey {
  Physical = 'physical',
  Special = 'special',
  Status = 'status',
}

export const DamageClassLabels: Record<DamageClassKey, string> = {
  [DamageClassKey.Physical]: 'Physical',
  [DamageClassKey.Special]: 'Special',
  [DamageClassKey.Status]: 'Status',
}

export enum TypeKey {
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

export const TypeLabels: Record<TypeKey, string> = {
  [TypeKey.Normal]: 'Normal',
  [TypeKey.Fighting]: 'Fighting',
  [TypeKey.Flying]: 'Flying',
  [TypeKey.Poison]: 'Poison',
  [TypeKey.Ground]: 'Ground',
  [TypeKey.Rock]: 'Rock',
  [TypeKey.Bug]: 'Bug',
  [TypeKey.Ghost]: 'Ghost',
  [TypeKey.Steel]: 'Steel',
  [TypeKey.Fire]: 'Fire',
  [TypeKey.Water]: 'Water',
  [TypeKey.Grass]: 'Grass',
  [TypeKey.Electric]: 'Electric',
  [TypeKey.Psychic]: 'Psychic',
  [TypeKey.Ice]: 'Ice',
  [TypeKey.Dragon]: 'Dragon',
  [TypeKey.Dark]: 'Dark',
  [TypeKey.Fairy]: 'Fairy',
}

// prettier-ignore
export enum VersionGroupKey {
  RedBlue = 'red-blue',
  Yellow = 'yellow',
  GoldSilver = 'gold-silver',
  Crystal = 'crystal',
  RubySapphire = 'ruby-sapphire',
  Emerald = 'emerald',
  FireRedLeafGreen = 'firered-leafgreen',
  DiamondPearl = 'diamond-pearl',
  Platinum = 'platinum',
  HeartGoldSoulSilver = 'heartgold-soulsilver',
  BlackWhite = 'black-white',
  Black2White2 = 'black-2-white-2',
  Xy = 'x-y',
  OmegaRubyAlphaSapphire = 'omega-ruby-alpha-sapphire',
  SunMoon = 'sun-moon',
  UltraSunUltraMoon = 'ultra-sun-ultra-moon',
  SwordShield = 'sword-shield',
  BrilliantDiamondShiningPearl = 'brilliant-diamond-shining-pearl',
  ScarletViolet = 'scarlet-violet',
}

// prettier-ignore
export const VersionGroupLabels: Record<VersionGroupKey, string> = {
  [VersionGroupKey.RedBlue]: 'Red & Blue',
  [VersionGroupKey.Yellow]: 'Yellow',
  [VersionGroupKey.GoldSilver]: 'Gold & Silver',
  [VersionGroupKey.Crystal]: 'Crystal',
  [VersionGroupKey.RubySapphire]: 'Ruby & Sapphire',
  [VersionGroupKey.Emerald]: 'Emerald',
  [VersionGroupKey.FireRedLeafGreen]: 'FireRed & LeafGreen',
  [VersionGroupKey.DiamondPearl]: 'Diamond & Pearl',
  [VersionGroupKey.Platinum]: 'Platinum',
  [VersionGroupKey.HeartGoldSoulSilver]: 'HeartGold & SoulSilver',
  [VersionGroupKey.BlackWhite]: 'Black & White',
  [VersionGroupKey.Black2White2]: 'Black 2 & White 2',
  [VersionGroupKey.Xy]: 'XY',
  [VersionGroupKey.OmegaRubyAlphaSapphire]: 'Omega Ruby & Alpha Sapphire',
  [VersionGroupKey.SunMoon]: 'Sun & Moon',
  [VersionGroupKey.UltraSunUltraMoon]: 'Ultra Sun & Ultra Moon',
  [VersionGroupKey.SwordShield]: 'Sword & Shield',
  [VersionGroupKey.BrilliantDiamondShiningPearl]: 'Brilliant Diamond & Shining Pearl',
  [VersionGroupKey.ScarletViolet]: 'Scarlet & Violet',
}

export enum Effectiveness {
  Immune = 0.0,
  Quarter = 0.25,
  Half = 0.5,
  Neutral = 1.0,
  Double = 2.0,
  Quadruple = 4.0,
}

export type TypeEffectiveness = Record<TypeKey, Effectiveness>

export type TypeRelation = {
  type: Type
  effectiveness: Effectiveness
}

export function getEffectiveness(...typeResources: Type[]): TypeEffectiveness {
  // Initialize all types with neutral effectiveness.
  const effectiveness = Object.fromEntries(
    Object.values(TypeKey).map((type) => [type, 1])
  ) as TypeEffectiveness

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
