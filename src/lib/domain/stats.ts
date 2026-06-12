// Single source of truth for base stats: short and full display labels.
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
