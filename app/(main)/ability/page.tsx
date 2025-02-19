import { Metadata } from 'next'
import Link from 'next/link'
import { Ability } from 'pokedex-promise-v2'
import { getTestAbilitiesList, pokeapi } from '@/lib/providers'
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
  const abilitiesList = await getTestAbilitiesList()
  const abilities: Ability[] = await pokeapi.getResource(
    abilitiesList.results.map((ability) => ability.url)
  )

  return (
    <div className="container mx-auto px-4">
      <ul className="flex flex-col gap-2">
        {abilities.map((ability) => {
          const name = getTranslation(ability.names, 'name')
          return (
            <li key={ability.name} className="flex">
              <Link
                href={`/ability/${ability.name}`}
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
