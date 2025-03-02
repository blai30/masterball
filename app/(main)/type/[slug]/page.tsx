import { Metadata } from 'next'
import { pokeapi } from '@/lib/providers'
import {
  getEffectiveness,
  getTranslation,
  TypeLabels,
  TypeKey,
  TypeRelation,
} from '@/lib/utils/pokeapiHelpers'
import EffectivenessMultiplier from '@/components/details/typeEffectiveness/EffectivenessMultiplier'
import TypePill from '@/components/TypePill'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return Object.values(TypeKey).map((type) => ({
    slug: type,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const type = await pokeapi.getTypeByName(slug)
  const translatedName = getTranslation(type.names, 'name')

  const metadata: Metadata = {
    title: `${translatedName} | Type`,
    twitter: {
      card: 'summary_large_image',
    },
    openGraph: {
      images: [],
    },
  }

  return metadata
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const type = await pokeapi.getTypeByName(slug)
  const name = TypeLabels[slug as TypeKey]

  const allTypeResources = await pokeapi.getTypeByName(
    Object.values(TypeKey).map((t) => t)
  )
  const typeEffectiveness = getEffectiveness(type)
  const allTypeRelations = allTypeResources.map(
    (typeResource) =>
      ({
        type: typeResource,
        effectiveness: typeEffectiveness[typeResource.name as TypeKey],
      }) as TypeRelation
  )

  return (
    <div className="flex w-full flex-col gap-8">
      <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
        {name}
      </h1>
      <div className="flex h-80 w-full flex-col flex-wrap items-center justify-center gap-2 p-4 sm:h-full">
        {allTypeRelations.map((relation) => {
          const effectiveness = relation.effectiveness
          const type = relation.type
          return (
            <div key={type.id} className="flex flex-row items-center gap-1">
              <TypePill variant={type.name} size="medium" />
              <EffectivenessMultiplier variant={effectiveness} />
            </div>
          )
        })}
      </div>
      <h2 className="text-xl font-medium text-black dark:text-white">
        Pokemon
      </h2>
      <ul className="flex flex-wrap gap-2">
        {type.pokemon.map((pokemon) => (
          <li
            key={pokemon.pokemon.name}
            className="w-32 list-none font-medium text-pretty"
          >
            {pokemon.pokemon.name}
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-medium text-black dark:text-white">Moves</h2>
      <ul className="flex flex-wrap gap-2">
        {type.moves
          .toSorted((a, b) => a.name.localeCompare(b.name))
          .map((move) => (
            <li
              key={move.name}
              className="w-32 list-none font-medium text-pretty"
            >
              {move.name}
            </li>
          ))}
      </ul>
    </div>
  )
}
