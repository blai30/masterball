import { Metadata } from 'next'
import pMap from 'p-map'
import { Item } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import { itemResourceList } from '@/lib/providers'
import {
  getTranslation,
  ItemCategoryKey,
  ItemCategoryToPocket,
  ItemPocketKey,
} from '@/lib/utils/pokeapi-helpers'
import { excludedItems } from '@/lib/utils/excluded-slugs'
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
  const items = await pMap(
    itemResourceList.results
      .filter(
        (result) =>
          !excludedItems.includes(result.name) &&
          !result.name.startsWith('dynamax-crystal-')
      )
      .slice(
        process?.env?.NODE_ENV === 'development' ? 300 : undefined,
        process?.env?.NODE_ENV === 'development' ? 340 : undefined
      ),
    async (result) => {
      const resource = await pokeapi.getResource<Item>(result.url)
      return resource
    },
    { concurrency: 20 }
  )

  const itemsData = items
    .filter(
      (resource) =>
        resource?.names?.find((name) => name?.language?.name === 'en') !==
        undefined
    )
    .map((resource) => {
      const { id, name, category } = resource
      const imageUrl = `https://raw.githubusercontent.com/blai30/PokemonSpritesDump/refs/heads/main/items/item_${name}.webp`
      const pocket = ItemCategoryToPocket[category.name as ItemCategoryKey]

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
        category: category.name as ItemCategoryKey,
        pocket: pocket as ItemPocketKey,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="mx-auto w-full max-w-[96rem]">
      <ItemCardGrid data={itemsData} />
    </div>
  )
}
