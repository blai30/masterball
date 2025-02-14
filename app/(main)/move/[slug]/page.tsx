import { Metadata } from 'next'
import { getTestMovesList, pokeapi } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import TypePill from '@/components/TypePill'
import DamageClassPill from '@/components/DamageClassPill'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const movesList = await getTestMovesList()

  return movesList.results.map((result) => ({
    slug: result.name,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const move = await pokeapi.getMoveByName(slug)
  const translatedName = getTranslation(move.names, 'name')

  const metadata: Metadata = {
    title: translatedName,
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
  const move = await pokeapi.getMoveByName(slug)
  const name = getTranslation(move.names, 'name')
  const shortEffect = getTranslation(move.effect_entries, 'short_effect')
  const stats = [
    { name: 'Power', value: move.power ?? '—' },
    { name: 'Accuracy', value: `${move.accuracy ?? '—'}%` },
    { name: 'PP', value: move.pp },
  ]

  return (
    <div className="relative w-full overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            {name}
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
            {shortEffect}
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col-reverse gap-1">
                <dt className="text-base/7 text-gray-300">{stat.name}</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <TypePill variant={move.type.name} />
        <DamageClassPill variant={move.damage_class.name} />
      </div>
    </div>
  )
}
