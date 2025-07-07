import { Metadata } from 'next'
import pMap from 'p-map'
import { Move } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import MoveCardGrid from '@/components/compounds/MoveCardGrid'

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
      ? await pokeapi.getList('move', 40, 0)
      : await pokeapi.getList('move', 1200, 0)

  const moves = await pMap(
    moveList.results,
    async (result) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const move = await pokeapi.getResource<Move>(result.url)
      return move
    },
    { concurrency: 8 }
  )

  const movesData = moves.map((move) => ({
    id: move.id,
    slug: move.name,
    name: getTranslation(move.names, 'name')!,
    description: getTranslation(move.effect_entries, 'short_effect') || '',
  }))

  return (
    <div className="mx-auto max-w-[96rem] px-4">
      <MoveCardGrid movesData={movesData} />
    </div>
  )
}
