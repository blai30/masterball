import { Metadata } from 'next'
import { pokeapi } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const eggGroups = await pokeapi.getEggGroupsList()

  return eggGroups.results.map((eggGroup) => ({
    slug: eggGroup.name,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const eggGroup = await pokeapi.getEggGroupByName(slug)
  const translatedName = getTranslation(eggGroup.names, 'name')

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
  return <div>{slug}</div>
}
