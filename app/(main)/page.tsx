import { Metadata } from 'next'
import { PokemonSpecies } from 'pokedex-promise-v2'
import { getTestSpeciesList, pokeapi } from '@/lib/providers'
import MonsterCardGrid from '@/components/MonsterCardGrid'
import { batchFetch, getTranslation } from '@/lib/utils/pokeapiHelpers'

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
          limit: 1025,
          offset: 0,
        })

  const species = (await batchFetch(
    speciesList.results.map((result) => result.url),
    (url) => pokeapi.getResource(url),
    10
  )) as PokemonSpecies[]

  const speciesData = species.map((specie) => ({
    id: specie.id,
    slug: specie.name,
    name: getTranslation(specie.names, 'name')!,
  }))

  return (
    <div className="container mx-auto">
      <MonsterCardGrid speciesData={speciesData} />
    </div>
  )
}
