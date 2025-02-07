import { Metadata } from 'next'
import { Suspense } from 'react'
import { getTestSpeciesList, pokeapi } from '@/lib/providers'
import {
  getTranslation,
  StatLabels,
  StatName,
} from '@/lib/utils/pokeapiHelpers'
import MonsterHero from '@/components/MonsterHero'
import LoadingSection from '@/components/details/LoadingSection'
import StatsSection from '@/components/details/stats/StatsSection'
import TypeEffectivenessSection from '@/components/details/typeEffectiveness/TypeEffectivenessSection'
import AbilitiesSection from '@/components/details/abilities/AbilitiesSection'
import EvolutionSection from '@/components/details/evolution/EvolutionSection'
import MovesSection from '@/components/details/moves/MovesSection'
import HeightMetadata from '@/components/metadata/HeightMetadata'
import WeightMetadata from '@/components/metadata/WeightMetadata'
import GenderRatioMetadata from '@/components/metadata/GenderRatioMetadata'
import CaptureRateMetadata from '@/components/metadata/CaptureRateMetadata'
import HatchCounterMetadata from '@/components/metadata/HatchCounterMetadata'
import EggGroupMetadata from '@/components/metadata/EggGroupMetadata'
import GrowthRateMetadata from '@/components/metadata/GrowthRateMetadata'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  // const speciesList = await pokeapi.getPokemonSpeciesList({
  //   limit: 22,
  //   offset: 718,
  // })

  const speciesList = await getTestSpeciesList()

  return speciesList.results.map((result) => ({
    name: result.name,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>
}): Promise<Metadata> {
  const { name } = await params
  const species = await pokeapi.getPokemonSpeciesByName(name)
  const pokemon = await pokeapi.getPokemonByName(
    species.varieties.find((variety) => variety.is_default)!.pokemon.name
  )
  const typeResources = await pokeapi.getTypeByName(
    pokemon.types.map((type) => type.type.name)
  )
  const types = typeResources.map((resource) => {
    const typeName = getTranslation(resource.names, 'name')!
    return {
      id: resource.id,
      key: resource.name,
      typeName,
    }
  })
  const stats = pokemon.stats.map(
    (stat) => `${StatLabels[stat.stat.name as StatName]}: ${stat.base_stat}`
  )

  const imageId = pokemon.id.toString().padStart(4, '0')
  const translatedName = getTranslation(species.names, 'name')

  const metadata: Metadata = {
    title: `${translatedName} #${imageId}`,
    description: `${types.map((t) => t.typeName).join(' ')}\n${stats.join('\n')}`,
    twitter: {
      card: 'summary_large_image',
    },
    openGraph: {
      images: `${process.env.NEXT_PUBLIC_BASEPATH}/monster/${name}/og.png`,
    },
  }

  return metadata
}

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const species = await pokeapi.getPokemonSpeciesByName(name)
  const pokemon = await pokeapi.getPokemonByName(
    species.varieties.find((variety) => variety.is_default)!.pokemon.name
  )
  const eggGroups = await pokeapi.getEggGroupByName(
    species.egg_groups.map((group) => group.name)
  )
  const growthRate = await pokeapi.getGrowthRateByName(species.growth_rate.name)

  return (
    <div className="container mx-auto flex flex-col gap-4 xl:gap-8">
      <div className="w-full">
        {/* Hero section */}
        <MonsterHero species={species} pokemon={pokemon} />
      </div>
      <div className="flex w-full flex-col gap-4">
        {/* Metadata section */}
        <section className="flex w-full flex-col gap-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8">
            <HeightMetadata height={pokemon.height} />
            <WeightMetadata weight={pokemon.weight} />
            <GenderRatioMetadata genderRate={species.gender_rate} />
            <CaptureRateMetadata captureRate={species.capture_rate} />
            <HatchCounterMetadata hatchCounter={species.hatch_counter!} />
            <EggGroupMetadata eggGroups={eggGroups} />
            <GrowthRateMetadata growthRate={growthRate} />

            {/* Placeholder EV yield metadata */}
            <div className="flex flex-col gap-2 rounded-lg p-4">
              <p className="text-sm/6 text-zinc-600 dark:text-zinc-400">
                {'Effort Value yield'}
              </p>
              <div className="flex flex-col">
                <p className="flex gap-x-1">
                  <span className="text-base font-light text-black dark:text-white">
                    —
                  </span>
                  <span className="text-base text-zinc-600 dark:text-zinc-400">
                    stat
                  </span>
                </p>
                <p className="flex gap-x-1">
                  <span className="text-base font-light text-black dark:text-white">
                    —
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="flex w-full flex-col lg:grow lg:flex-row">
          {/* First column on large screens */}
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full flex-col sm:flex-row lg:flex-col xl:flex-row">
              <Suspense fallback={<LoadingSection />}>
                <StatsSection pokemon={pokemon} />
              </Suspense>
              <Suspense fallback={<LoadingSection />}>
                <TypeEffectivenessSection pokemon={pokemon} />
              </Suspense>
            </div>
            <Suspense fallback={<LoadingSection />}>
              <AbilitiesSection pokemon={pokemon} />
            </Suspense>
            <Suspense fallback={<LoadingSection />}>
              <EvolutionSection species={species} />
            </Suspense>
          </div>
          {/* Second column on large screens */}
          <div className="flex w-full flex-col gap-4 lg:min-w-2xl">
            <Suspense fallback={<LoadingSection />}>
              <MovesSection pokemon={pokemon} />
            </Suspense>
            <LoadingSection />
          </div>
        </div>
      </div>
    </div>
  )
}
