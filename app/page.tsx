import { Suspense } from 'react'
import { NamedAPIResource } from 'pokedex-promise-v2'
import { getMockSpeciesList, pokeapi } from '@/lib/providers'
import LoadingCard from '@/components/LoadingCard'
import MonsterCard from '@/components/MonsterCard'

export const dynamic = 'force-static'

export default async function Home() {
  // const speciesList = await pokeapi.getPokemonSpeciesList({
  //   limit: 22,
  //   offset: 718,
  // })

  const speciesList = await getMockSpeciesList()

  return (
    <div className="container mx-auto">
      {/* <input type="search" name="search" placeholder="Search..." /> */}
      <ul className="2xs:grid-cols-2 xs:grid-cols-3 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
        {/* <ul className="flex flex-row flex-wrap gap-4"> */}
        {speciesList.results.map((speciesResource: NamedAPIResource) => (
          <li key={speciesResource.name} className="col-span-1">
            <Suspense fallback={<LoadingCard />}>
              <MonsterCard
                key={speciesResource.id}
                speciesResource={speciesResource}
              />
            </Suspense>
          </li>
        ))}
        <li className="group relative col-span-1 rounded-lg">
          <LoadingCard />
        </li>
      </ul>
    </div>
  )
}
