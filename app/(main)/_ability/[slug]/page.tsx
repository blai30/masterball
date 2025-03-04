import { Metadata } from 'next'
import { getTestAbilitiesList, pokeapi } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const abilitiesList = await getTestAbilitiesList()

  return abilitiesList.results.map((result) => ({
    slug: result.name,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const ability = await pokeapi.getAbilityByName(slug)
  const translatedName = getTranslation(ability.names, 'name')

  const metadata: Metadata = {
    title: `${translatedName} | Ability`,
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
  const ability = await pokeapi.getAbilityByName(slug)
  const name = getTranslation(ability.names, 'name')
  const shortEffect = getTranslation(ability.effect_entries, 'short_effect')

  return (
    <div className="relative w-full overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
          {name}
        </h1>
        <p className="mt-8 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
          {shortEffect}
        </p>
      </div>
    </div>
  )
}
