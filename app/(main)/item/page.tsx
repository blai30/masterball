import { Metadata } from 'next'
import pMap from 'p-map'
import { Item } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import { getTestItemsList } from '@/lib/providers'
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
  // const itemsList =
  //   process?.env?.NODE_ENV && process?.env?.NODE_ENV === 'development'
  //     ? await getTestItemsList()
  //     : await pokeapi.getList('item', 200, 0)
  const itemsList = await pokeapi.getList('item', 40, 0)

  const items = await pMap(
    itemsList.results,
    async (result) => {
      const species = await pokeapi.getResource<Item>(result.url)
      return species
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
