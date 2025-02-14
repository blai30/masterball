import { Metadata } from 'next'
import Link from 'next/link'
import { EggGroup } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: 'Home',
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
    <div className="container mx-auto">
      <ul className="flex flex-col gap-2">
        {eggGroups.map((eggGroup) => {
          const name = getTranslation(eggGroup.names, 'name')
          return (
            <li key={eggGroup.name}>
              <Link href={`/egg-group/${eggGroup.name}`} className="">
                <p className="font-medium text-blue-700 underline underline-offset-4 dark:text-blue-300">
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
