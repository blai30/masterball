import { Metadata } from 'next'
import { Suspense } from 'react'
import { getTestSpeciesList, pokeapi } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import LoadingSection from '@/components/details/LoadingSection'
import MonsterHero from '@/components/details/MonsterHero'
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
import EffortValueYieldMetadata from '@/components/metadata/EffortValueYieldMetadata'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  // const speciesList = await pokeapi.getPokemonSpeciesList({
  //   limit: 22,
  //   offset: 718,
  // })

  const speciesList = await getTestSpeciesList()

  return speciesList.results.map((result) => ({
    slug: result.name,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const species = await pokeapi.getPokemonSpeciesByName(slug)
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

  const imageId = pokemon.id.toString().padStart(4, '0')
  const translatedName = getTranslation(species.names, 'name')

  const metadata: Metadata = {
    title: `${translatedName} #${imageId}`,
    description: `${types.map((t) => t.typeName).join('/')}`,
    twitter: {
      card: 'summary_large_image',
    },
    openGraph: {
      images: [
        {
          url: `/${slug}/og.png`,
          width: 800,
          height: 400,
          alt: `${translatedName} splash image`,
        },
      ],
    },
  }

  return metadata
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const species = await pokeapi.getPokemonSpeciesByName(slug)
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
            <EffortValueYieldMetadata stats={pokemon.stats} />
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
          </div>
        </div>
      </div>
    </div>
  )
}
