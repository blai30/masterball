import pMap from 'p-map'
import type {
  FlavorText,
  Pokemon,
  PokemonForm,
  PokemonSpecies,
  Type,
} from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import { excludedVariants } from '@/lib/utils/excludedSlugs'

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
      : // : await pokeapi.getPokemonFormByName(variant.name).catch(() => undefined)
        await fetch(`https://pokeapi.co/api/v2/pokemon-form/${variant.name}`)
          .then((response) => response.json() as Promise<PokemonForm>)
          .catch(() => undefined)

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

export const getMonstersBySpecies = async (
  species: PokemonSpecies
): Promise<Monster[]> => {
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
    { concurrency: 4 }
  )

  const monsters = await pMap(
    variants,
    async (variant) => {
      const resource = createMonster(variant, species)
      return resource
    },
    { concurrency: 4 }
  )
  return monsters
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

export const StatLabelsFull: Record<StatKey, string> = {
  [StatKey.Hp]: 'HP',
  [StatKey.Attack]: 'Attack',
  [StatKey.Defense]: 'Defense',
  [StatKey.SpecialAttack]: 'Special Attack',
  [StatKey.SpecialDefense]: 'Special Defense',
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

export enum ItemPocketKey {
  Misc = 'misc',
  Medicine = 'medicine',
  Pokeballs = 'pokeballs',
  Machines = 'machines',
  Berries = 'berries',
  Mail = 'mail',
  Battle = 'battle',
  Key = 'key',
}

export const ItemPocketLabels: Record<ItemPocketKey, string> = {
  [ItemPocketKey.Misc]: 'Items',
  [ItemPocketKey.Medicine]: 'Medicine',
  [ItemPocketKey.Pokeballs]: 'Poké Balls',
  [ItemPocketKey.Machines]: 'TMs and HMs',
  [ItemPocketKey.Berries]: 'Berries',
  [ItemPocketKey.Mail]: 'Mail',
  [ItemPocketKey.Battle]: 'Battle Items',
  [ItemPocketKey.Key]: 'Key Items',
}

export enum ItemCategoryKey {
  StatBoosts = 'stat-boosts',
  EffortDrop = 'effort-drop',
  Medicine = 'medicine',
  Other = 'other',
  InAPinch = 'in-a-pinch',
  PickyHealing = 'picky-healing',
  TypeProtection = 'type-protection',
  BakingOnly = 'baking-only',
  Collectibles = 'collectibles',
  Evolution = 'evolution',
  Spelunking = 'spelunking',
  HeldItems = 'held-items',
  Choice = 'choice',
  EffortTraining = 'effort-training',
  BadHeldItems = 'bad-held-items',
  Training = 'training',
  Plates = 'plates',
  SpeciesSpecific = 'species-specific',
  TypeEnhancement = 'type-enhancement',
  EventItems = 'event-items',
  Gameplay = 'gameplay',
  PlotAdvancement = 'plot-advancement',
  Unused = 'unused',
  Loot = 'loot',
  AllMail = 'all-mail',
  Vitamins = 'vitamins',
  Healing = 'healing',
  PpRecovery = 'pp-recovery',
  Revival = 'revival',
  StatusCures = 'status-cures',
  Mulch = 'mulch',
  SpecialBalls = 'special-balls',
  StandardBalls = 'standard-balls',
  DexCompletion = 'dex-completion',
  Scarves = 'scarves',
  AllMachines = 'all-machines',
  Flutes = 'flutes',
  ApricornBalls = 'apricorn-balls',
  ApricornBox = 'apricorn-box',
  DataCards = 'data-cards',
  Jewels = 'jewels',
  MiracleShooter = 'miracle-shooter',
  MegaStones = 'mega-stones',
  Memories = 'memories',
  ZCrystals = 'z-crystals',
  SpeciesCandies = 'species-candies',
  CatchingBonus = 'catching-bonus',
  DynamaxCrystals = 'dynamax-crystals',
  NatureMints = 'nature-mints',
  CurryIngredients = 'curry-ingredients',
  TeraShard = 'tera-shard',
  SandwichIngredients = 'sandwich-ingredients',
  TmMaterials = 'tm-materials',
  Picnic = 'picnic',
}

export const ItemCategoryLabels: Record<ItemCategoryKey, string> = {
  [ItemCategoryKey.StatBoosts]: 'Stat boosts',
  [ItemCategoryKey.EffortDrop]: 'Effort drop',
  [ItemCategoryKey.Medicine]: 'Medicine',
  [ItemCategoryKey.Other]: 'Other',
  [ItemCategoryKey.InAPinch]: 'In a pinch',
  [ItemCategoryKey.PickyHealing]: 'Picky healing',
  [ItemCategoryKey.TypeProtection]: 'Type protection',
  [ItemCategoryKey.BakingOnly]: 'Baking only',
  [ItemCategoryKey.Collectibles]: 'Collectibles',
  [ItemCategoryKey.Evolution]: 'Evolution',
  [ItemCategoryKey.Spelunking]: 'Spelunking',
  [ItemCategoryKey.HeldItems]: 'Held items',
  [ItemCategoryKey.Choice]: 'Choice',
  [ItemCategoryKey.EffortTraining]: 'Effort training',
  [ItemCategoryKey.BadHeldItems]: 'Bad held items',
  [ItemCategoryKey.Training]: 'Training',
  [ItemCategoryKey.Plates]: 'Plates',
  [ItemCategoryKey.SpeciesSpecific]: 'Species-specific',
  [ItemCategoryKey.TypeEnhancement]: 'Type enhancement',
  [ItemCategoryKey.EventItems]: 'Event items',
  [ItemCategoryKey.Gameplay]: 'Gameplay',
  [ItemCategoryKey.PlotAdvancement]: 'Plot advancement',
  [ItemCategoryKey.Unused]: 'Unused',
  [ItemCategoryKey.Loot]: 'Loot',
  [ItemCategoryKey.AllMail]: 'All mail',
  [ItemCategoryKey.Vitamins]: 'Vitamins',
  [ItemCategoryKey.Healing]: 'Healing',
  [ItemCategoryKey.PpRecovery]: 'PP recovery',
  [ItemCategoryKey.Revival]: 'Revival',
  [ItemCategoryKey.StatusCures]: 'Status cures',
  [ItemCategoryKey.Mulch]: 'Mulch',
  [ItemCategoryKey.SpecialBalls]: 'Special balls',
  [ItemCategoryKey.StandardBalls]: 'Standard balls',
  [ItemCategoryKey.DexCompletion]: 'Dex completion',
  [ItemCategoryKey.Scarves]: 'Scarves',
  [ItemCategoryKey.AllMachines]: 'All machines',
  [ItemCategoryKey.Flutes]: 'Flutes',
  [ItemCategoryKey.ApricornBalls]: 'Apricorn balls',
  [ItemCategoryKey.ApricornBox]: 'Apricorn Box',
  [ItemCategoryKey.DataCards]: 'Data Cards',
  [ItemCategoryKey.Jewels]: 'Jewels',
  [ItemCategoryKey.MiracleShooter]: 'Miracle Shooter',
  [ItemCategoryKey.MegaStones]: 'Mega Stones',
  [ItemCategoryKey.Memories]: 'Memories',
  [ItemCategoryKey.ZCrystals]: 'Z-Crystals',
  [ItemCategoryKey.SpeciesCandies]: 'Species candies',
  [ItemCategoryKey.CatchingBonus]: 'Catching bonus',
  [ItemCategoryKey.DynamaxCrystals]: 'Dynamax crystals',
  [ItemCategoryKey.NatureMints]: 'Nature mints',
  [ItemCategoryKey.CurryIngredients]: 'Curry ingredients',
  [ItemCategoryKey.TeraShard]: 'Tera Shard',
  [ItemCategoryKey.SandwichIngredients]: 'Sandwich ingredients',
  [ItemCategoryKey.TmMaterials]: 'TM Materials',
  [ItemCategoryKey.Picnic]: 'Picnic items',
}

export const ItemCategoryToPocket: Record<ItemCategoryKey, ItemPocketKey> = {
  [ItemCategoryKey.StatBoosts]: ItemPocketKey.Battle,
  [ItemCategoryKey.EffortDrop]: ItemPocketKey.Berries,
  [ItemCategoryKey.Medicine]: ItemPocketKey.Berries,
  [ItemCategoryKey.Other]: ItemPocketKey.Berries,
  [ItemCategoryKey.InAPinch]: ItemPocketKey.Berries,
  [ItemCategoryKey.PickyHealing]: ItemPocketKey.Berries,
  [ItemCategoryKey.TypeProtection]: ItemPocketKey.Berries,
  [ItemCategoryKey.Collectibles]: ItemPocketKey.Misc,
  [ItemCategoryKey.BakingOnly]: ItemPocketKey.Berries,
  [ItemCategoryKey.Evolution]: ItemPocketKey.Misc,
  [ItemCategoryKey.EventItems]: ItemPocketKey.Key,
  [ItemCategoryKey.Spelunking]: ItemPocketKey.Misc,
  [ItemCategoryKey.Gameplay]: ItemPocketKey.Key,
  [ItemCategoryKey.HeldItems]: ItemPocketKey.Misc,
  [ItemCategoryKey.PlotAdvancement]: ItemPocketKey.Key,
  [ItemCategoryKey.Choice]: ItemPocketKey.Misc,
  [ItemCategoryKey.Unused]: ItemPocketKey.Key,
  [ItemCategoryKey.EffortTraining]: ItemPocketKey.Misc,
  [ItemCategoryKey.BadHeldItems]: ItemPocketKey.Misc,
  [ItemCategoryKey.AllMail]: ItemPocketKey.Mail,
  [ItemCategoryKey.Vitamins]: ItemPocketKey.Medicine,
  [ItemCategoryKey.SpecialBalls]: ItemPocketKey.Pokeballs,
  [ItemCategoryKey.Training]: ItemPocketKey.Misc,
  [ItemCategoryKey.AllMachines]: ItemPocketKey.Machines,
  [ItemCategoryKey.Flutes]: ItemPocketKey.Battle,
  [ItemCategoryKey.Healing]: ItemPocketKey.Medicine,
  [ItemCategoryKey.StandardBalls]: ItemPocketKey.Pokeballs,
  [ItemCategoryKey.Plates]: ItemPocketKey.Misc,
  [ItemCategoryKey.PpRecovery]: ItemPocketKey.Medicine,
  [ItemCategoryKey.ApricornBalls]: ItemPocketKey.Pokeballs,
  [ItemCategoryKey.SpeciesSpecific]: ItemPocketKey.Misc,
  [ItemCategoryKey.ApricornBox]: ItemPocketKey.Key,
  [ItemCategoryKey.Revival]: ItemPocketKey.Medicine,
  [ItemCategoryKey.TypeEnhancement]: ItemPocketKey.Misc,
  [ItemCategoryKey.DataCards]: ItemPocketKey.Key,
  [ItemCategoryKey.StatusCures]: ItemPocketKey.Medicine,
  [ItemCategoryKey.Loot]: ItemPocketKey.Misc,
  [ItemCategoryKey.Mulch]: ItemPocketKey.Misc,
  [ItemCategoryKey.DexCompletion]: ItemPocketKey.Misc,
  [ItemCategoryKey.Scarves]: ItemPocketKey.Misc,
  [ItemCategoryKey.Jewels]: ItemPocketKey.Misc,
  [ItemCategoryKey.MiracleShooter]: ItemPocketKey.Battle,
  [ItemCategoryKey.MegaStones]: ItemPocketKey.Misc,
  [ItemCategoryKey.ZCrystals]: ItemPocketKey.Key,
  [ItemCategoryKey.NatureMints]: ItemPocketKey.Medicine,
  [ItemCategoryKey.CatchingBonus]: ItemPocketKey.Berries,
  [ItemCategoryKey.Memories]: ItemPocketKey.Misc,
  [ItemCategoryKey.SpeciesCandies]: ItemPocketKey.Misc,
  [ItemCategoryKey.DynamaxCrystals]: ItemPocketKey.Misc,
  [ItemCategoryKey.CurryIngredients]: ItemPocketKey.Misc,
  [ItemCategoryKey.TeraShard]: ItemPocketKey.Misc,
  [ItemCategoryKey.SandwichIngredients]: ItemPocketKey.Misc,
  [ItemCategoryKey.TmMaterials]: ItemPocketKey.Misc,
  [ItemCategoryKey.Picnic]: ItemPocketKey.Misc,
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
  BrilliantDiamondShiningPearl = 'brilliant-diamond-shining-pearl',
  ScarletViolet = 'scarlet-violet',
}

// prettoer-ignore
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
  [VersionGroupKey.LetsGoPikachuLetsGoEevee]:
    "Let's Go Pikachu & Let's Go Eevee",
  [VersionGroupKey.SwordShield]: 'Sword & Shield',
  [VersionGroupKey.BrilliantDiamondShiningPearl]:
    'Brilliant Diamond & Shining Pearl',
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

export type MoveInfo = {
  id: string
  slug: string
  name: string
  defaultDescription: string
  flavorTextEntries: FlavorText[]
  type: string
  damageClass: string
  power?: number
  accuracy?: number
  pp?: number
}

export type MoveRow = MoveInfo & {
  versionGroup: string
}
