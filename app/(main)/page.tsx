import { Metadata } from 'next'
import pMap from 'p-map'
import { PokemonSpecies } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import { getTestSpeciesList } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import SpeciesCardGrid from '@/components/compounds/SpeciesCardGrid'

export const dynamic = 'force-static'
export const dynamicParams = false

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
      const resource = await pokeapi.getResource<PokemonSpecies>(result.url)
      return resource
    },
    { concurrency: 4 }
  )

  const speciesData = species.map((specie) => ({
    id: specie.id,
    slug: specie.name,
    name: getTranslation(specie.names, 'name')!,
  }))

  return (
    <div className="mx-auto w-full max-w-[96rem] px-4">
      <SpeciesCardGrid data={speciesData} />
    </div>
  )
}
