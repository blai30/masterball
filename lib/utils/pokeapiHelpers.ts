import { pokeapi } from '@/lib/providers'
import { Pokemon, PokemonSpecies, Type } from 'pokedex-promise-v2'

/**
 * Generic function to batch PokeAPI requests to avoid hitting rate limits
 * and improve performance when fetching multiple resources.
 *
 * @param identifiers Array of names, IDs, or URLs to fetch.
 * @param fetchFunction Function that fetches a single resource.
 * @param batchSize Max number of requests to make in parallel (default: 20).
 * @returns Promise with array of results in the same order as identifiers.
 */
export async function batchFetch<T, R>(
  identifiers: T[],
  fetchFunction: (identifier: T) => Promise<R>,
  batchSize: number = 20
): Promise<R[]> {
  const results: R[] = []

  // Process in batches.
  for (let i = 0; i < identifiers.length; i += batchSize) {
    const batch = identifiers.slice(i, i + batchSize)

    // Fetch each batch in parallel and get all outcomes.
    const batchResults = await Promise.allSettled(
      batch.map((identifier) => fetchFunction(identifier))
    )

    // Filter fulfilled promises and extract their values.
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      } else {
        console.error(
          `Error fetching resource for ${String(batch[index])}:`,
          result.reason
        )
      }
    })
  }

  return results
}

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

export const createMonster = async (
  variant: Pokemon,
  species: PokemonSpecies
): Promise<Monster> => {
  const form =
    variant.is_default || species.name === variant.name
      ? undefined
      : await pokeapi.getPokemonFormByName(variant.name).catch(() => undefined)

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
    imageUrl:
      variant?.sprites?.other?.home?.front_default ??
      variant?.sprites?.other['official-artwork']?.front_default ??
      `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png` ??
      undefined,
  } as Monster
}

export const getMonstersBySpecies = async (
  species: PokemonSpecies
): Promise<Monster[]> => {
  const variants: Pokemon[] = await batchFetch(
    species.varieties.map((v) => v.pokemon.url),
    (url) => pokeapi.getResource(url)
  )

  return Promise.all(variants.map((variant) => createMonster(variant, species)))
}

export enum LearnMethodKey {
  FormChange = 'form-change',
  LevelUp = 'level-up',
  Machine = 'machine',
  Tutor = 'tutor',
  Egg = 'egg',
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
  LetsGoPikachuLetsGoEevee = 'lets-go-pikachu-lets-go-eevee',
  SwordShield = 'sword-shield',
  // TheIsleOfArmor = 'the-isle-of-armor',
  // TheCrownTundra = 'the-crown-tundra',
  BrilliantDiamondShiningPearl = 'brilliant-diamond-shining-pearl',
  ScarletViolet = 'scarlet-violet',
  // TheTealMask = 'the-teal-mask',
  // TheIndigoDisk = 'the-indigo-disk',
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
  [VersionGroupKey.LetsGoPikachuLetsGoEevee]: 'Let\'s Go Pikachu & Let\'s Go Eevee',
  [VersionGroupKey.SwordShield]: 'Sword & Shield',
  // [VersionGroupKey.TheIsleOfArmor]: 'Sword & Shield: The Isle of Armor',
  // [VersionGroupKey.TheCrownTundra]: 'Sword & Shield: The Crown Tundra',
  [VersionGroupKey.BrilliantDiamondShiningPearl]: 'Brilliant Diamond & Shining Pearl',
  [VersionGroupKey.ScarletViolet]: 'Scarlet & Violet',
  // [VersionGroupKey.TheTealMask]: 'Scarlet & Violet: The Teal Mask',
  // [VersionGroupKey.TheIndigoDisk]: 'Scarlet & Violet: The Indigo Disk',
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

export type MoveRow = {
  id: string
  slug: string
  versionGroup: string
  type: TypeKey
  damageClass: DamageClassKey
  name: string
  power: number | null
  accuracy: number | null
  pp: number
}
