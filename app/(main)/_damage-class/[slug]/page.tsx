import { Metadata } from 'next'
import { pokeapi } from '@/lib/providers'
import {
  DamageClassLabels,
  DamageClassKey,
  getTranslation,
} from '@/lib/utils/pokeapiHelpers'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return Object.values(DamageClassKey).map((type) => ({
    slug: type,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const damageClass = await pokeapi.getMoveDamageClassByName(slug)
  const translatedName = getTranslation(damageClass.names, 'name')

  const metadata: Metadata = {
    title: `${translatedName} | Damage Class`,
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
  const damageClass = await pokeapi.getMoveDamageClassByName(slug)
  const name = DamageClassLabels[slug as DamageClassKey]

  return (
    <div className="flex w-full flex-col gap-8">
      <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
        {name}
      </h1>
      <h2 className="text-xl font-medium text-black dark:text-white">Moves</h2>
      <ul className="flex flex-wrap gap-2">
        {damageClass.moves
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
