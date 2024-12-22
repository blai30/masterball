import MonsterCard from '@/components/MonsterCard'
import { PokeAPI } from 'pokeapi-types'

export default async function Home() {
  const language = 'en'
  const speciesList = await fetch(
    'https://pokeapi.co/api/v2/pokemon-species?limit=20'
  ).then((res) => res.json() as Promise<PokeAPI.NamedAPIResourceList>)
  const species = (await Promise.all(
    speciesList.results.map((result) =>
      fetch(result.url).then(
        (res) => res.json() as Promise<PokeAPI.PokemonSpecies>
      )
    )
  )) as PokeAPI.PokemonSpecies[]

  return (
    <div className="container mx-auto">
      {/* <input type="search" name="search" placeholder="Search..." /> */}
      <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {species.map((result) => (
          <li
            key={result.name}
            className="group relative h-96 rounded-lg bg-white shadow-xl sm:aspect-[4/5] sm:h-auto"
          >
            <MonsterCard species={result} language={language} />
          </li>
        ))}
      </ul>
    </div>
  )
}
