import { Metadata } from 'next'
import Link from 'next/link'
import { Item } from 'pokedex-promise-v2'
import { getTestItemsList, pokeapi } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import Image from 'next/image'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: 'Items',
    twitter: {
      card: 'summary',
    },
  }

  return metadata
}

export default async function Page() {
  const itemsList = await getTestItemsList()
  const items: Item[] = await pokeapi.getResource(
    itemsList.results.map((item) => item.url)
  )

  return (
    <div className="container mx-auto px-4">
      <ul className="flex flex-col gap-2">
        {items.map((item) => {
          const name = getTranslation(item.names, 'name')
          return (
            <li key={item.name} className="flex">
              <Link
                href={`/item/${item.name}`}
                className="flex flex-row items-center gap-2 border"
              >
                <Image
                  src={item.sprites.default!}
                  alt={name!}
                  width={64}
                  height={64}
                  className="[image-rendering:pixelated]"
                />
                <p className="font-medium text-blue-700 underline underline-offset-4 transition-colors hover:text-blue-800 hover:duration-0 dark:text-blue-300 dark:hover:text-blue-200">
                  {name}
                </p>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
