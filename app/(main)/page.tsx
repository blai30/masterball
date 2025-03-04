import { Metadata } from 'next'
import { Pokemon, PokemonSpecies } from 'pokedex-promise-v2'
import { getTestSpeciesList, pokeapi } from '@/lib/providers'
import MonsterCardGrid from '@/components/MonsterCardGrid'
import { batchFetch, getTranslation, Monster } from '@/lib/utils/pokeapiHelpers'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: 'Pokemon List',
    twitter: {
      card: 'summary',
    },
  }

  return metadata
}

export default async function Home() {
  const speciesList =
    process?.env?.NODE_ENV && process?.env?.NODE_ENV === 'development'
      ? await getTestSpeciesList()
      : await pokeapi.getPokemonSpeciesList({
          limit: 151,
          offset: 0,
        })

  // const species = await pokeapi.getPokemonSpeciesByName(
  //   speciesList.results.map((resource: NamedAPIResource) => resource.name)
  // )
  const species = (await batchFetch(
    speciesList.results.map((result) => result.url),
    (url) => pokeapi.getResource(url),
    10
  )) as PokemonSpecies[]

  // Extract all Pokemon URLs for batch fetching.
  const pokemonUrls = species.map(
    (species) =>
      species.varieties.find((variety) => variety.is_default)!.pokemon.url
  )

  // Batch fetch all Pokemon data.
  const pokemonData = (await batchFetch(
    pokemonUrls,
    (url) => pokeapi.getResource(url),
    10
  )) as Pokemon[]

  // Create a lookup map to connect Pokemon data with their species.
  const pokemonByUrl = new Map<string, Pokemon>()
  pokemonData.forEach((pokemon) => {
    pokemonByUrl.set(pokemon.species.url, pokemon)
  })

  // Create monsters with the pre-fetched data.
  const monsters: Monster[] = species.map((species) => {
    const name = getTranslation(species.names, 'name')
    const pokemon =
      pokemonByUrl.get(species.url) ||
      pokemonData.find(
        (p) => p.species.url === species.url || p.species.name === species.name
      )!

    return {
      id: species.id,
      key: species.name,
      name,
      species,
      pokemon,
    } as Monster
  })

  return (
    <div className="container mx-auto">
      <MonsterCardGrid monsters={monsters} />
    </div>
  )
}
