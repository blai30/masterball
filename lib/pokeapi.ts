import { PokeAPI } from 'pokeapi-types'

export async function getSpeciesList() {
  const response = await fetch(
    'https://pokeapi.co/api/v2/pokemon-species?limit=2000'
  )
  const data: PokeAPI.NamedAPIResourceList = await response.json()
  return data
}

export async function getSpecies(name: string) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`)
  const data: PokeAPI.PokemonSpecies = await response.json()
  return data
}

export async function getPokemon(name: string) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  const data: PokeAPI.Pokemon = await response.json()
  return data
}
