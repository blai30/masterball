import { Metadata } from 'next'
import { Suspense } from 'react'
import { NamedAPIResource, PokemonSpecies } from 'pokedex-promise-v2'
import { getTestSpeciesList, pokeapi } from '@/lib/providers'
import LoadingCard from '@/components/LoadingCard'
import MonsterCard from '@/components/MonsterCard'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: 'Home',
    twitter: {
      card: 'summary',
    },
  }

  return metadata
}

export default async function Home() {
  // const speciesList = await pokeapi.getPokemonSpeciesList({
  //   limit: 22,
  //   offset: 718,
  // })

  const speciesList = await getTestSpeciesList()
  const species = await pokeapi.getPokemonSpeciesByName(
    speciesList.results.map((resource: NamedAPIResource) => resource.name)
  )

  return (
    <div className="container mx-auto">
      {/* <input type="search" name="search" placeholder="Search..." /> */}
      <ul className="2xs:grid-cols-2 xs:grid-cols-3 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
        {/* <ul className="flex flex-row flex-wrap gap-4"> */}
        {species.map((specie: PokemonSpecies) => (
          <li key={specie.name} className="col-span-1">
            <Suspense fallback={<LoadingCard />}>
              <MonsterCard key={specie.id} species={specie} />
            </Suspense>
          </li>
        ))}
        <li className="col-span-1">
          <LoadingCard />
        </li>
      </ul>
    </div>
  )
}
