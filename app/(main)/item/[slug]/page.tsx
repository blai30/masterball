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
  return <div>{slug}</div>
}
