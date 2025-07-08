import { Metadata } from 'next'
import pMap from 'p-map'
import { Item } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import InfoCardGrid from '@/components/compounds/InfoCardGrid'

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: 'Item List',
    twitter: {
      card: 'summary',
    },
  }

  return metadata
}

export default async function Home() {
  const itemsList =
    process?.env?.NODE_ENV && process?.env?.NODE_ENV === 'development'
      ? await pokeapi.getList('item', 40, 0)
      : await pokeapi.getList('item', 3000, 0)

  const items = await pMap(
    itemsList.results.filter(
      (result) => !result.name.startsWith('dynamax-crystal-')
    ),
    async (result) => {
      const resource = await pokeapi.getResource<Item>(result.url)
      return resource
    },
    { concurrency: 4 }
  )

  const itemsData = items
    .filter(
      (resource) =>
        resource?.names?.find((name) => name?.language?.name === 'en') !==
        undefined
    )
    .map((resource) => {
      const { id, name } = resource
      const imageId = id.toString().padStart(4, '0')
      const imageUrl = `https://resource.pokemon-home.com/battledata/img/item/item_${imageId}.png`
      return {
        id,
        slug: name,
        name: getTranslation(resource.names, 'name')!,
        defaultDescription:
          getTranslation(resource.effect_entries, 'short_effect') ?? '',
        flavorTextEntries: resource.flavor_text_entries.filter(
          (entry) => entry.language.name === 'en'
        ),
        imageUrl,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="mx-auto w-full max-w-[96rem] px-4">
      <InfoCardGrid data={itemsData} />
    </div>
  )
}
