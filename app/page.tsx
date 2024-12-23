import MonsterCard from '@/components/MonsterCard'
import { PokeAPI } from 'pokeapi-types'

export default async function Home() {
  const language = 'en'
  const speciesList = await fetch(
    'https://pokeapi.co/api/v2/pokemon-species?limit=20',
  ).then((res) => res.json() as Promise<PokeAPI.NamedAPIResourceList>)
  const species = (await Promise.all(
    speciesList.results.map((result) =>
      fetch(result.url).then(
        (res) => res.json() as Promise<PokeAPI.PokemonSpecies>,
      ),
    ),
  )) as PokeAPI.PokemonSpecies[]

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
