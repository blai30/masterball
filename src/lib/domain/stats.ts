import type { Pokemon } from 'pokedex-promise-v2'

export const STATS = {
  hp: {
    short: 'HP',
    full: 'HP',
  },
  attack: {
    short: 'Attack',
    full: 'Attack',
  },
  defense: {
    short: 'Defense',
    full: 'Defense',
  },
  'special-attack': {
    short: 'Sp. Atk',
    full: 'Special Attack',
  },
  'special-defense': {
    short: 'Sp. Def',
    full: 'Special Defense',
  },
  speed: {
    short: 'Speed',
    full: 'Speed',
  },
} as const

export type StatKey = keyof typeof STATS

export type BaseStat = {
  key: StatKey
  base: number
}

export function buildBaseStats(pokemon: Pokemon): BaseStat[] {
  return pokemon.stats.map((stat) => ({
    key: stat.stat.name as StatKey,
    base: stat.base_stat,
  }))
}
