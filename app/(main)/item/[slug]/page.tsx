import { Metadata } from 'next'
import { getTestItemsList, pokeapi } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const itemsList = await getTestItemsList()

  return itemsList.results.map((result) => ({
    slug: result.name,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = await pokeapi.getItemByName(slug)
  const translatedName = getTranslation(item.names, 'name')

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
  const item = await pokeapi.getItemByName(slug)
  const name = getTranslation(item.names, 'name')
  const shortEffect = getTranslation(item.effect_entries, 'short_effect')

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
