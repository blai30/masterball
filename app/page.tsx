import Link from 'next/link'
import { getSpeciesList, getSpecies } from '@/lib/pokeapi'

export default async function Home() {
  const language = 'en'
  const speciesList = await getSpeciesList()
  const species = await Promise.all(
    speciesList.results.map((result) => getSpecies(result.name))
  )

  return (
    <main className="flex min-h-screen flex-col items-start justify-between p-24">
      {/* <input type="search" name="search" placeholder="Search..." /> */}
      <ul className="flex flex-col gap-2">
        {species.map((result) => (
          <li key={result.name}>
            <Link
              href={`monster/${result.name}`}
              className="flex flex-row gap-2 rounded-lg bg-zinc-900 px-4 py-2 hover:bg-zinc-800"
            >
              <p className="w-12">{result.id}</p>
              <p>
                {result.names.find((name) => name.language.name === language)
                  ?.name ?? 'Unknown'}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
