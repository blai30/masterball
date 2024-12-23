import MonsterCard from '@/components/MonsterCard'
import Pokedex from 'pokedex-promise-v2'

export default async function Home() {
  const language = 'en'
  const pokeapi = new Pokedex()
  const speciesList = await pokeapi.getPokemonSpeciesList({ limit: 20 })
  const species = await pokeapi.getPokemonSpeciesByName(
    speciesList.results.map((result) => result.name),
  )

  return (
    <div className="container mx-auto">
      {/* <input type="search" name="search" placeholder="Search..." /> */}
      <ul className="grid grid-cols-1 gap-4 2xs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
        {species.map((result) => (
          <li
            key={result.name}
            className="group relative aspect-[3/2] rounded-lg shadow-xl 2xs:aspect-[4/5]"
          >
            <MonsterCard species={result} language={language} />
          </li>
        ))}
      </ul>
    </div>
  )
}
