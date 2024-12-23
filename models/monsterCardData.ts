import { Pokemon, PokemonSpecies } from 'pokedex-promise-v2'

export interface Monster {
  id: number
  name: string
  species: PokemonSpecies
  pokemon: Pokemon
  types: string[]
}
