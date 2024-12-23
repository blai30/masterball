import LoadingCard from '@/components/LoadingCard'
import MonsterCardSlot from '@/components/MonsterCardSlot'
// import { Monster } from '@/models'
import Pokedex, { NamedAPIResource } from 'pokedex-promise-v2'
import { Suspense } from 'react'

export default async function Home() {
  const language = 'en'
  const pokeapi = new Pokedex()
  const speciesResourceList = await pokeapi.getPokemonSpeciesList({ limit: 20 })
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
      <ul className="grid grid-cols-1 2xs:grid-cols-2 gap-4 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
        {speciesResourceList.results.map(
          (speciesResource: NamedAPIResource) => (
            <li
              key={speciesResource.name}
              className="group relative rounded-lg shadow-xl aspect-[4/5]"
            >
              <Suspense fallback={<LoadingCard />}>
                <MonsterCardSlot
                  key={speciesResource.id}
                  speciesResource={speciesResource}
                  language={language}
                />
              </Suspense>
            </li>
          ),
        )}
      </ul>
    </div>
  )
}
