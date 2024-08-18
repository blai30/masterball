import Link from 'next/link'
import { PokeAPI } from 'pokeapi-types'

async function getSpeciesList() {
  const response = await fetch(
    'https://pokeapi.co/api/v2/pokemon-species?limit=2000'
  )
  const data: PokeAPI.NamedAPIResourceList = await response.json()
  return data
}

async function getSpecies(resource: PokeAPI.NamedAPIResource) {
  const response = await fetch(resource.url)
  const data: PokeAPI.PokemonSpecies = await response.json()
  return data
}

export default async function Home() {
  const language = 'en'
  const speciesList = await getSpeciesList()
  const species = await Promise.all(
    speciesList.results.map((result) => getSpecies(result))
  )

  return (
    <main className="flex min-h-screen flex-col items-start justify-between p-24">
      {/* <input type="search" name="search" placeholder="Search..." /> */}
      <ul className="flex flex-col gap-2">
        {species.map((result) => (
          <li key={result.name}>
            <Link href={`monster/${result.name}`} className="flex flex-row gap-2">
              <p className="w-12">{result.id}</p>
              <p>{result.names.find((name) => name.language.name === language)?.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
