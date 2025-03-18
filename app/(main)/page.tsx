import { Metadata } from 'next'
import pMap from 'p-map'
import { PokemonSpecies } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import { getTestSpeciesList } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import MonsterCardGrid from '@/components/MonsterCardGrid'

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
      : await pokeapi.getList('pokemon-species', 1025, 0)

  const species = await pMap(
    speciesList.results,
    async (result) => {
      const species = await pokeapi.getResource<PokemonSpecies>(result.url)
      return species
    },
    { concurrency: 4 }
  )

  const speciesData = species.map((specie) => ({
    id: specie.id,
    slug: specie.name,
    name: getTranslation(specie.names, 'name')!,
  }))

  return (
    <div className="container mx-auto px-4">
      <MonsterCardGrid speciesData={speciesData} />
    </div>
  )
}
