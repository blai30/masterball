import { Metadata } from 'next'
import pMap from 'p-map'
import { Ability } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import { getTestAbilitiesList } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import AbilityCardGrid from '@/components/compounds/AbilityCardGrid'

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
  // const abilityList =
  //   process?.env?.NODE_ENV && process?.env?.NODE_ENV === 'development'
  //     ? await getTestAbilitiesList()
  //     : await pokeapi.getList('ability', 100, 0)
  const abilityList = await pokeapi.getList('ability', 40, 0)

  const abilities = await pMap(
    abilityList.results,
    async (result) => {
      const ability = await pokeapi.getResource<Ability>(result.url)
      return ability
    },
    { concurrency: 4 }
  )

  const abilitiesData = abilities.map((ability) => ({
    id: ability.id,
    slug: ability.name,
    name: getTranslation(ability.names, 'name')!,
    description: getTranslation(ability.effect_entries, 'short_effect') || '',
  }))

  return (
    <div className="mx-auto max-w-[96rem] px-4">
      <AbilityCardGrid abilitiesData={abilitiesData} />
    </div>
  )
}
