import pMap from 'p-map'
import type {
  EvolutionChain,
  EvolutionDetail,
  Item,
  Name,
  Pokemon,
  PokemonSpecies,
} from 'pokedex-promise-v2'

import pokeapi from '@/lib/api/pokeapi'
import type { TypeKey } from '@/lib/domain/types'
import { excludedVariants } from '@/lib/utils/excluded-slugs'
import { getTranslation } from '@/lib/utils/pokeapi-helpers'

export type ChipIconName =
  | 'arrow-up'
  | 'arrow-left-right'
  | 'sun'
  | 'moon'
  | 'sunset'
  | 'heart'
  | 'sparkles'
  | 'map-pin'
  | 'cloud-rain'
  | 'venus'
  | 'mars'
  | 'rotate-ccw'
  | 'swords'
  | 'users'
  | 'gem'

export type ChipIcon =
  | { type: 'lucide'; name: ChipIconName }
  | { type: 'item'; url: string }
  | { type: 'pokemon-type'; key: TypeKey }

export type Chip = {
  label: string
  icon: ChipIcon
}

export type EvolutionConditionView = {
  chips: Chip[]
  full: string
}

// Item sprites are nullable in the api; fall back to a generic gem icon.
const itemChip = (item: Item, label: string): Chip =>
  item.sprites.default
    ? { label, icon: { type: 'item', url: item.sprites.default } }
    : { label, icon: { type: 'lucide', name: 'gem' } }

// Fetch a referenced resource and return its localized display name, falling back to the slug.
const resolveName = async (ref: { name: string; url: string }): Promise<string> => {
  const resource = await pokeapi.getResource<{ names: Name[] }>(ref.url)
  return getTranslation(resource.names, 'name') ?? ref.name
}

// Maps one pokeapi EvolutionDetail to localized chips plus a full-sentence
// tooltip. Async because most conditions reference another resource whose
// localized display name must be fetched (deduped by the build-time cache).
export const describeEvolution = async (
  detail: EvolutionDetail
): Promise<EvolutionConditionView> => {
  const chips: Chip[] = []
  // Head clause for the full sentence, followed by trailing modifier clauses.
  let head = 'Level up'
  const mods: string[] = []

  const trigger = detail.trigger.name ?? 'level-up'

  // Base trigger and its primary chip.
  if (trigger === 'use-item' && detail.item) {
    const item = await pokeapi.getResource<Item>(detail.item.url)
    const name = getTranslation(item.names, 'name') ?? detail.item.name
    chips.push(itemChip(item, name))
    head = `Use ${name}`
  } else if (trigger === 'trade') {
    if (detail.trade_species) {
      const name = await resolveName(detail.trade_species)
      chips.push({ label: `Trade for ${name}`, icon: { type: 'lucide', name: 'arrow-left-right' } })
      head = `Trade for ${name}`
    } else {
      chips.push({ label: 'Trade', icon: { type: 'lucide', name: 'arrow-left-right' } })
      head = 'Trade'
    }
  } else if (trigger === 'shed') {
    chips.push({ label: 'Empty party slot', icon: { type: 'lucide', name: 'users' } })
    head = 'Level up with an empty party slot and a spare Poke Ball'
  } else if (trigger === 'level-up' && detail.min_level) {
    chips.push({ label: `Lv. ${detail.min_level}`, icon: { type: 'lucide', name: 'arrow-up' } })
    head = `Reaches level ${detail.min_level}`
  } else if (trigger === 'level-up') {
    chips.push({ label: 'Level up', icon: { type: 'lucide', name: 'arrow-up' } })
    head = 'Level up'
  } else {
    // spin, tower-of-darkness/water, three-critical-hits, take-damage,
    // recoil-damage, agile/strong-style-move, other, and any future trigger.
    const name = await resolveName(detail.trigger)
    chips.push({ label: name, icon: { type: 'lucide', name: 'arrow-up' } })
    head = name
  }

  // Held item (can accompany trade or level-up triggers).
  if (detail.held_item) {
    const item = await pokeapi.getResource<Item>(detail.held_item.url)
    const name = getTranslation(item.names, 'name') ?? detail.held_item.name
    chips.push(itemChip(item, name))
    mods.push(`holding ${name}`)
  }

  // Time of day.
  const timeOfDay: Record<string, { label: string; icon: ChipIconName }> = {
    day: { label: 'Day', icon: 'sun' },
    night: { label: 'Night', icon: 'moon' },
    dusk: { label: 'Dusk', icon: 'sunset' },
  }
  if (detail.time_of_day && timeOfDay[detail.time_of_day]) {
    const entry = timeOfDay[detail.time_of_day]
    chips.push({ label: entry.label, icon: { type: 'lucide', name: entry.icon } })
    mods.push(`during the ${detail.time_of_day}`)
  }

  // Friendship, affection, beauty.
  if (detail.min_happiness) {
    chips.push({ label: 'High friendship', icon: { type: 'lucide', name: 'heart' } })
    mods.push('with high friendship')
  }
  if (detail.min_affection) {
    chips.push({
      label: `${detail.min_affection} affection`,
      icon: { type: 'lucide', name: 'heart' },
    })
    mods.push(`with at least ${detail.min_affection} affection`)
  }
  if (detail.min_beauty) {
    chips.push({ label: 'High beauty', icon: { type: 'lucide', name: 'sparkles' } })
    mods.push('with high beauty')
  }

  // Known move and known move type.
  if (detail.known_move) {
    const name = await resolveName(detail.known_move)
    chips.push({ label: `Knows ${name}`, icon: { type: 'lucide', name: 'swords' } })
    mods.push(`knowing ${name}`)
  }
  if (detail.known_move_type) {
    const name = await resolveName(detail.known_move_type)
    chips.push({
      label: `${name} move`,
      icon: { type: 'pokemon-type', key: detail.known_move_type.name as TypeKey },
    })
    mods.push(`knowing a ${name}-type move`)
  }

  // Location and region.
  if (detail.location) {
    const name = await resolveName(detail.location)
    chips.push({ label: name, icon: { type: 'lucide', name: 'map-pin' } })
    mods.push(`at ${name}`)
  }
  if (detail.region) {
    const name = await resolveName(detail.region)
    chips.push({ label: name, icon: { type: 'lucide', name: 'map-pin' } })
    mods.push(`in ${name}`)
  }

  // Party requirements.
  if (detail.party_species) {
    const name = await resolveName(detail.party_species)
    chips.push({ label: `${name} in party`, icon: { type: 'lucide', name: 'users' } })
    mods.push(`with ${name} in the party`)
  }
  if (detail.party_type) {
    const name = await resolveName(detail.party_type)
    chips.push({
      label: `${name} in party`,
      icon: { type: 'pokemon-type', key: detail.party_type.name as TypeKey },
    })
    mods.push(`with a ${name}-type in the party`)
  }

  // Gender (1 = female, 2 = male).
  if (detail.gender === 1) {
    chips.push({ label: 'Female', icon: { type: 'lucide', name: 'venus' } })
    mods.push('if female')
  } else if (detail.gender === 2) {
    chips.push({ label: 'Male', icon: { type: 'lucide', name: 'mars' } })
    mods.push('if male')
  }

  // Relative physical stats (1 = Atk > Def, 0 = equal, -1 = Atk < Def).
  const relativeStats: Record<number, string> = {
    1: 'Attack > Defense',
    0: 'Attack = Defense',
    [-1]: 'Attack < Defense',
  }
  if (
    detail.relative_physical_stats !== null &&
    detail.relative_physical_stats !== undefined &&
    relativeStats[detail.relative_physical_stats]
  ) {
    const label = relativeStats[detail.relative_physical_stats]
    chips.push({ label, icon: { type: 'lucide', name: 'swords' } })
    mods.push(`when ${label}`)
  }

  // Misc conditions.
  if (detail.needs_overworld_rain) {
    chips.push({ label: 'Raining', icon: { type: 'lucide', name: 'cloud-rain' } })
    mods.push('while raining')
  }
  if (detail.turn_upside_down) {
    chips.push({ label: 'Upside down', icon: { type: 'lucide', name: 'rotate-ccw' } })
    mods.push('with the console upside down')
  }
  if (detail.needs_multiplayer) {
    chips.push({ label: 'Link', icon: { type: 'lucide', name: 'users' } })
    mods.push('via a linked game')
  }

  // Fallback when no condition is recognized at all.
  if (chips.length === 0) {
    chips.push({ label: 'Special', icon: { type: 'lucide', name: 'arrow-up' } })
    head = 'Special condition'
  }

  const full = [head, ...mods].join(' ')
  return { chips, full }
}

export type EvolutionNodeData = {
  species: PokemonSpecies
  pokemon: Pokemon
  conditions: EvolutionConditionView[]
  evolvesTo: EvolutionNodeData[]
}

async function buildEvolutionNode(chain: EvolutionChain['chain']): Promise<EvolutionNodeData> {
  const species = await pokeapi.getResource<PokemonSpecies>(chain.species.url)
  const defaultVariant = species.varieties
    .filter((v) => !excludedVariants.includes(v.pokemon.name))
    .find((v) => v.is_default)

  const pokemon = await pokeapi.getResource<Pokemon>(defaultVariant!.pokemon.url)
  const conditions = await pMap(chain.evolution_details, (detail) => describeEvolution(detail), {
    concurrency: 4,
  })
  const evolvesTo = await pMap(chain.evolves_to, (child) => buildEvolutionNode(child), {
    concurrency: 4,
  })

  return { species, pokemon, conditions, evolvesTo }
}

export async function buildEvolutionTree(species: PokemonSpecies): Promise<EvolutionNodeData> {
  const evolutionChain = await pokeapi.getResource<EvolutionChain>(species.evolution_chain.url)
  return buildEvolutionNode(evolutionChain.chain)
}
