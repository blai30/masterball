import { Metadata } from 'next'
import pMap from 'p-map'
import { Move } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import MoveCardGrid from '@/components/compounds/MoveCardGrid'
import { MoveCardProps } from '@/components/compounds/MoveCard'

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
      const move = await pokeapi.getResource<Move>(result.url)
      return move
    },
    { concurrency: 4 }
  )

  const movesData: MoveCardProps[] = moves
    .filter(
      (resource) =>
        resource?.names?.find((name) => name?.language?.name === 'en') !==
        undefined
    )
    .map((resource) => ({
      id: resource.id,
      slug: resource.name,
      name: getTranslation(resource.names, 'name')!,
      defaultDescription:
        getTranslation(resource.effect_entries, 'short_effect') ?? '',
      flavorTextEntries: resource.flavor_text_entries.filter(
        (entry) => entry.language.name === 'en'
      ),
      type: resource.type.name,
      damageClass: resource.damage_class.name,
      power: resource.power ?? undefined,
      accuracy: resource.accuracy ?? undefined,
      pp: resource.pp ?? undefined,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="mx-auto w-full max-w-[96rem] px-4">
      <MoveCardGrid data={movesData} />
    </div>
  )
}
