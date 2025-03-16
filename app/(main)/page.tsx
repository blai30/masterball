import { Metadata } from 'next'
import pMap from 'p-map'
import type { NamedAPIResourceList, PokemonSpecies } from 'pokedex-promise-v2'
import { getTestSpeciesList } from '@/lib/providers'
import MonsterCardGrid from '@/components/MonsterCardGrid'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

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
      : await fetch(
          'https://pokeapi.co/api/v2/pokemon-species?limit=1025&offset=0'
        ).then((response) => response.json() as Promise<NamedAPIResourceList>)

  const species = await pMap(
    speciesList.results,
    async (result) => {
      const species = await fetch(result.url).then(
        (response) => response.json() as Promise<PokemonSpecies>
      )
      return species
    },
    { concurrency: 16 }
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
