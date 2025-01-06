import { Suspense } from 'react'
import { NamedAPIResource } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import LoadingCard from '@/components/LoadingCard'
import MonsterCard from '@/components/MonsterCard'

export default async function Home() {
  const speciesResourceList = await pokeapi.getPokemonSpeciesList({
    limit: 40,
    offset: 718,
  })

  return (
    <div className="container mx-auto">
      {/* <input type="search" name="search" placeholder="Search..." /> */}
      <ul className="2xs:grid-cols-2 xs:grid-cols-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
        {/* <ul className="flex flex-row flex-wrap gap-4"> */}
        {speciesResourceList.results.map(
          (speciesResource: NamedAPIResource) => (
            <li
              key={speciesResource.name}
              className="group relative col-span-1 rounded-lg"
            >
              <Suspense fallback={<LoadingCard />}>
                <MonsterCard
                  key={speciesResource.id}
                  speciesResource={speciesResource}
                />
              </Suspense>
            </li>
          )
        )}
        <li className="group relative col-span-1 rounded-lg">
          <LoadingCard />
        </li>
      </ul>
    </div>
  )
}
