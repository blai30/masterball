import { Metadata } from 'next'
import pMap from 'p-map'
import { Move } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import { getTestMovesList } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: 'Move List',
    twitter: {
      card: 'summary',
    },
  }

  return metadata
}

export default async function Home() {
  const moveList =
    process?.env?.NODE_ENV && process?.env?.NODE_ENV === 'development'
      ? await getTestMovesList()
      : await pokeapi.getList('move', 200, 0)

  const moves = await pMap(
    moveList.results,
    async (result) => {
      const move = await pokeapi.getResource<Move>(result.url)
      return move
    },
    { concurrency: 4 }
  )

  const movesData = moves.map((move) => ({
    id: move.id,
    slug: move.name,
    name: getTranslation(move.names, 'name')!,
  }))

  return (
    <div className="mx-auto max-w-[96rem] px-4">
    </div>
  )
}
