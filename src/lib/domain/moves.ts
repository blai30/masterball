import pMap from 'p-map'
import type { FlavorText, Machine, Move, MoveElement, Pokemon } from 'pokedex-promise-v2'

import pokeapi from '@/lib/api/pokeapi'
import { getTranslation, resolveFlavorText } from '@/lib/utils/pokeapi-helpers'

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

export type MoveRow = {
  id: string
  slug: string
  name: string
  type: string
  damageClass: string
  power?: number
  accuracy?: number
  pp?: number
  versionGroup: string
  // Resolved at build for the default version group; loaded lazily otherwise.
  description?: string
}

export type MoveData = {
  name: string
  type: string
  damageClass: string
  power?: number
  accuracy?: number
  pp?: number
}

export type MovesDataMap = Record<string, MoveData>

// slug -> versionGroup -> description. The '_default' key holds the short-effect fallback.
export type MovesDescriptionsMap = Record<string, Record<string, string>>

export const LearnMethodKey = {
  FormChange: 'form-change',
  LevelUp: 'level-up',
  Machine: 'machine',
  Tutor: 'tutor',
  Egg: 'egg',
} as const

export type LearnMethodKey = (typeof LearnMethodKey)[keyof typeof LearnMethodKey]

// Specific learn data: move slug, version group, method, and id (level/TM).
export type LearnsetEntry = {
  slug: string
  versionGroup: string
  method: LearnMethodKey
  id: string
}

export function buildMoveData(move: Move): MoveData {
  return {
    name: getTranslation(move.names, 'name')!,
    type: move.type.name,
    damageClass: move.damage_class.name,
    power: move.power || undefined,
    accuracy: move.accuracy || undefined,
    pp: move.pp ?? undefined,
  }
}

export function resolveMoveDescription(move: Move, versionGroup: string): string {
  return (
    resolveFlavorText(move.flavor_text_entries, versionGroup) ??
    getTranslation(move.effect_entries, 'short_effect') ??
    ''
  )
}

// Map of versionGroup -> description for a single move, with a '_default' short-effect fallback.
export function buildMoveDescriptions(move: Move): Record<string, string> {
  const descriptions: Record<string, string> = {
    _default: getTranslation(move.effect_entries, 'short_effect') ?? '',
  }
  for (const entry of move.flavor_text_entries) {
    const versionGroup = entry.version_group?.name
    if (entry.language.name !== 'en' || !versionGroup) continue
    // First entry wins, matching resolveMoveDescription's find().
    if (!(versionGroup in descriptions)) {
      descriptions[versionGroup] = entry.flavor_text
    }
  }
  return descriptions
}

export function emptyByMethod(): Record<LearnMethodKey, MoveRow[]> {
  return {
    [LearnMethodKey.FormChange]: [],
    [LearnMethodKey.LevelUp]: [],
    [LearnMethodKey.Machine]: [],
    [LearnMethodKey.Tutor]: [],
    [LearnMethodKey.Egg]: [],
  }
}

// Always the full move list: the static JSON must cover every move a monster
// can reference, even in dev where the move catalog page is truncated.
async function fetchAllMoves(): Promise<Move[]> {
  const list = await pokeapi.getList('move', 1200)
  return pMap(list.results, (result) => pokeapi.getResource<Move>(result.url), {
    concurrency: 10,
  })
}

export async function buildMovesDataMap(): Promise<MovesDataMap> {
  const moves = await fetchAllMoves()
  const data: MovesDataMap = {}
  for (const move of moves) {
    data[move.name] = buildMoveData(move)
  }
  return data
}

export async function buildMovesDescriptionsMap(): Promise<MovesDescriptionsMap> {
  const moves = await fetchAllMoves()
  const descriptions: MovesDescriptionsMap = {}
  for (const move of moves) {
    descriptions[move.name] = buildMoveDescriptions(move)
  }
  return descriptions
}

// The one join that turns a learnset plus shared move data into renderable rows.
// Used by the MovesSection for non-default version groups, and by
// buildMovesData at build time for the default version group.
export function assembleRowsByMethod(
  learnset: LearnsetEntry[],
  movesData: MovesDataMap,
  descriptions: MovesDescriptionsMap | null,
  versionGroup: string
): Record<LearnMethodKey, MoveRow[]> {
  const result = emptyByMethod()
  for (const entry of learnset) {
    if (entry.versionGroup !== versionGroup) continue
    const moveData = movesData[entry.slug]
    if (!moveData) continue
    result[entry.method].push({
      ...moveData,
      id: entry.id,
      slug: entry.slug,
      versionGroup: entry.versionGroup,
      description: descriptions
        ? (descriptions[entry.slug]?.[versionGroup] ?? descriptions[entry.slug]?._default ?? '')
        : undefined,
    })
  }
  return result
}

function resolveLearnId(
  move: Move,
  detail: MoveElement['version_group_details'][number],
  machinesMap: Map<string, Machine[]>
): string {
  const method = detail.move_learn_method.name
  if (method === LearnMethodKey.LevelUp) {
    return detail.level_learned_at === 0 ? 'Evolve' : detail.level_learned_at.toString()
  }
  if (method === LearnMethodKey.Machine) {
    const machine = machinesMap
      .get(move.name)
      ?.find((mac) => mac.version_group.name === detail.version_group.name)
    if (machine?.item) return machine.item.name.toUpperCase()
  }
  return move.id.toString()
}

export async function buildMovesData(
  pokemon: Pokemon,
  defaultVersionGroup: string
): Promise<{
  learnset: LearnsetEntry[]
  defaultRows: Record<LearnMethodKey, MoveRow[]>
}> {
  if (pokemon.moves.length === 0) {
    return { learnset: [], defaultRows: emptyByMethod() }
  }

  const uniqueMoveUrls = [...new Set(pokemon.moves.map((move) => move.move.url))]
  const movesData = await pMap(uniqueMoveUrls, (url) => pokeapi.getResource<Move>(url), {
    concurrency: 10,
  })

  const uniqueMachineUrls = [
    ...new Set(
      movesData.flatMap((move) => move.machines?.map((machine) => machine.machine.url) ?? [])
    ),
  ]
  const machinesData = await pMap(uniqueMachineUrls, (url) => pokeapi.getResource<Machine>(url), {
    concurrency: 10,
  })

  const machinesMap = new Map<string, Machine[]>()
  for (const machine of machinesData) {
    const existing = machinesMap.get(machine.move.name) ?? []
    existing.push(machine)
    machinesMap.set(machine.move.name, existing)
  }

  const movesMap = Object.fromEntries(movesData.map((move) => [move.name, move])) as Record<
    string,
    Move
  >

  const knownMethods = new Set<string>(Object.values(LearnMethodKey))
  const learnset: LearnsetEntry[] = []

  for (const entry of pokemon.moves) {
    const move = movesMap[entry.move.name]
    if (!move) continue

    for (const detail of entry.version_group_details) {
      const method = detail.move_learn_method.name
      if (!knownMethods.has(method)) continue

      learnset.push({
        slug: entry.move.name,
        versionGroup: detail.version_group.name,
        method: method as LearnMethodKey,
        id: resolveLearnId(move, detail, machinesMap),
      })
    }
  }

  const dataMap: MovesDataMap = {}
  const descriptionsMap: MovesDescriptionsMap = {}
  for (const move of movesData) {
    dataMap[move.name] = buildMoveData(move)
    descriptionsMap[move.name] = {
      [defaultVersionGroup]: resolveMoveDescription(move, defaultVersionGroup),
    }
  }
  const defaultRows = assembleRowsByMethod(learnset, dataMap, descriptionsMap, defaultVersionGroup)

  return { learnset, defaultRows }
}
