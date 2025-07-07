import { Metadata } from 'next'
import pMap from 'p-map'
import { Item } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import ItemCardGrid from '@/components/compounds/ItemCardGrid'

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
    itemsList.results,
    async (result) => {
      const resource = await pokeapi.getResource<Item>(result.url)
      return resource
    },
    { concurrency: 4 }
  )

  const itemsData = items.map((item) => {
    const { id, name } = item
    const imageId = id.toString().padStart(4, '0')
    const imageUrl = `https://resource.pokemon-home.com/battledata/img/item/item_${imageId}.png`
    return {
      id,
      slug: name,
      name: getTranslation(item.names, 'name')!,
      description: getTranslation(item.effect_entries, 'short_effect') || '',
      imageUrl,
    }
  })

  return (
    <div className="mx-auto max-w-[96rem] px-4">
      <ItemCardGrid itemsData={itemsData} />
    </div>
  )
}
