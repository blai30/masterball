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
    title: `${translatedName} | Egg Group`,
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
  const eggGroup = await pokeapi.getEggGroupByName(slug)
  const name = getTranslation(eggGroup.names, 'name')

  return (
    <div className="flex w-full flex-col gap-8">
      <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
        {name}
      </h1>
      <ul className="flex flex-wrap gap-2">
        {eggGroup.pokemon_species.map((species) => (
          <li
            key={species.name}
            className="w-32 list-none font-medium text-pretty"
          >
            {species.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
