import { Metadata } from 'next'
import Link from 'next/link'
import { Move } from 'pokedex-promise-v2'
import { getTestMovesList, pokeapi } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: 'Moves',
    twitter: {
      card: 'summary',
    },
  }

  return metadata
}

export default async function Page() {
  const movesList = await getTestMovesList()
  const moves: Move[] = await pokeapi.getResource(
    movesList.results.map((move) => move.url)
  )

  return (
    <div className="container mx-auto px-4">
      <ul className="flex flex-col gap-2">
        {moves.map((move) => {
          const name = getTranslation(move.names, 'name')
          return (
            <li key={move.name} className="flex">
              <Link
                href={`/move/${move.name}`}
                className="flex flex-row items-center gap-2 border"
              >
                <p className="font-medium text-blue-700 underline underline-offset-4 transition-colors hover:text-blue-800 hover:duration-0 dark:text-blue-300 dark:hover:text-blue-200">
                  {name}
                </p>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
