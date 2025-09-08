import type { Metadata } from 'next'
import pMap from 'p-map'
import type { Ability } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import { getTranslation } from '@/lib/utils/pokeapi-helpers'
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
    { concurrency: 20 }
  )

  const abilitiesData = abilities
    .filter(
      (resource) =>
        resource.is_main_series &&
        resource?.names?.find((name) => name?.language?.name === 'en') !==
          undefined
    )
    .map((resource) => ({
      id: resource.id,
      slug: resource.name,
      name: getTranslation(resource.names, 'name')!,
      defaultDescription:
        getTranslation(resource.effect_entries, 'short_effect') ?? '',
      flavorTextEntries: resource.flavor_text_entries.filter(
        (entry) => entry.language.name === 'en'
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="mx-auto w-full max-w-[96rem]">
      <InfoCardGrid data={abilitiesData} filterByVersionGroup={true} />
    </div>
  )
}
