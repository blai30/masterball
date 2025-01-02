import { Suspense } from 'react'
import { NamedAPIResource } from 'pokedex-promise-v2'
import LoadingCard from '@/components/LoadingCard'
import MonsterCard from '@/components/MonsterCard'
import { pokeapi } from '@/lib/providers'
// import { Monster } from '@/models'

export default async function Home() {
  const language = 'en'
  const speciesResourceList = await pokeapi.getPokemonSpeciesList({
    limit: 20,
    offset: 721,
  })
  // const species = await pokeapi.getPokemonSpeciesByName(
  //   speciesList.results.map((result) => result.name),
  // )
  // const monsters: Monster[] = await Promise.all(
  //   species.map(async (specie) => {
  //     const pokemon = await pokeapi.getPokemonByName(
  //       specie.varieties[0].pokemon.name,
  //     )
  //     const types = await pokeapi.getTypeByName(
  //       pokemon.types.map((type) => type.type.name),
  //     )
  //     const typeNames = types.map(
  //       (type) =>
  //         type.names.find((value) => value.language.name === 'en')?.name ?? '',
  //     )

  //     return {
  //       id: specie.id,
  //       name:
  //         specie.names.find((name) => name.language.name === language)?.name ??
  //         '',
  //       species: specie,
  //       pokemon: pokemon,
  //       types: typeNames,
  //     }
  //   }),
  // )

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
                  language={language}
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
