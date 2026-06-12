import type { FlavorText, Move } from 'pokedex-promise-v2'

import { getTranslation } from '@/lib/utils/pokeapi-helpers'

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
    move.flavor_text_entries.find(
      (entry) => entry.language.name === 'en' && entry.version_group?.name === versionGroup
    )?.flavor_text ??
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
