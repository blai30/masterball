import pMap from 'p-map'
import { PokemonSpecies } from 'pokedex-promise-v2'
import { getTestSpeciesList } from '@/lib/providers'
import pokeapi from '@/lib/api/pokeapi'

export const getSpeciesData = async () => {
  const speciesList =
    process?.env?.NODE_ENV && process?.env?.NODE_ENV === 'development'
      ? await getTestSpeciesList()
      : await pokeapi.getList('pokemon-species', 1025, 0)

  const species = await pMap(
    speciesList.results,
    async (result) => {
      const species = await pokeapi.getResource<PokemonSpecies>(result.url)
      return species
    },
    { concurrency: 16 }
  )

  return species
}
