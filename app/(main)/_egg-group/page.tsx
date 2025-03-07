import { Metadata } from 'next'
import Link from 'next/link'
import { EggGroup } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: 'Egg groups',
    twitter: {
      card: 'summary',
    },
  }

  return metadata
}

export default async function Page() {
  const eggGroupsList = await pokeapi.getEggGroupsList()
  const eggGroups: EggGroup[] = await pokeapi.getResource(
    eggGroupsList.results.map((eggGroup) => eggGroup.url)
  )

  return (
    <div className="container mx-auto px-4">
      <ul className="flex flex-col gap-2">
        {eggGroups.map((eggGroup) => {
          const name = getTranslation(eggGroup.names, 'name')
          return (
            <li key={eggGroup.name} className="flex">
              <Link
                href={`/egg-group/${eggGroup.name}`}
                className="flex flex-row items-center gap-2 border"
              >
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
