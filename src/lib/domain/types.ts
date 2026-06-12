// Single source of truth for Pokemon type display labels. Type colors are CSS
// variables (--color-<slug>) defined in src/styles/globals.css and applied via
// inline style in the type components.
export const TYPES = {
  normal: 'Normal',
  fighting: 'Fighting',
  flying: 'Flying',
  poison: 'Poison',
  ground: 'Ground',
  rock: 'Rock',
  bug: 'Bug',
  ghost: 'Ghost',
  steel: 'Steel',
  fire: 'Fire',
  water: 'Water',
  grass: 'Grass',
  electric: 'Electric',
  psychic: 'Psychic',
  ice: 'Ice',
  dragon: 'Dragon',
  dark: 'Dark',
  fairy: 'Fairy',
} as const

export type TypeKey = keyof typeof TYPES

export const TYPE_KEYS = Object.keys(TYPES) as TypeKey[]
