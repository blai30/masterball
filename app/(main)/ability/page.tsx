import { Metadata } from 'next'
import pMap from 'p-map'
import { Ability } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import InfoCardGrid from '@/components/compounds/InfoCardGrid'

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: 'Ability List',
    twitter: {
      card: 'summary',
    },
  }

  return metadata
}

export default async function Home() {
  const abilityList =
    process?.env?.NODE_ENV && process?.env?.NODE_ENV === 'development'
      ? await pokeapi.getList('ability', 40, 0)
      : await pokeapi.getList('ability', 600, 0)

  const abilities = await pMap(
    abilityList.results,
    async (result) => {
      const resource = await pokeapi.getResource<Ability>(result.url)
      return resource
    },
    { concurrency: 4 }
  )

  const abilitiesData = abilities
    .map((ability) => ({
      id: ability.id,
      slug: ability.name,
      name: getTranslation(ability.names, 'name')!,
      description: getTranslation(ability.effect_entries, 'short_effect') || '',
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="mx-auto w-full max-w-[96rem] px-4">
      <InfoCardGrid data={abilitiesData} />
    </div>
  )
}
