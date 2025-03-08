import { Metadata } from 'next'
import { Suspense } from 'react'
import { PokemonSpecies } from 'pokedex-promise-v2'
import { getTestSpeciesList, pokeapi } from '@/lib/providers'
import { batchFetch, getTranslation } from '@/lib/utils/pokeapiHelpers'
import LoadingSection from '@/components/details/LoadingSection'
import StatsSection from '@/components/details/stats/StatsSection'
import TypeEffectivenessSection from '@/components/details/typeEffectiveness/TypeEffectivenessSection'
import AbilitiesSection from '@/components/details/abilities/AbilitiesSection'
import EvolutionSection from '@/components/details/evolution/EvolutionSection'
import CosmeticsSection from '@/components/details/cosmetics/CosmeticsSection'
import LocalizationSection from '@/components/details/localization/LocalizationSection'
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
  const speciesList =
    process?.env?.NODE_ENV && process?.env?.NODE_ENV === 'development'
      ? await getTestSpeciesList()
      : await pokeapi.getPokemonSpeciesList({
          limit: 1025,
          offset: 0,
        })

  const species = (await batchFetch(
    speciesList.results.map((result) => result.url),
    (url) => pokeapi.getResource(url),
    10
  )) as PokemonSpecies[]

  const params = species.flatMap((specie) =>
    specie.varieties.map((variant) => ({
      slug: specie.name,
      variant: variant.is_default ? undefined : [variant.pokemon.name],
    }))
  )

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; variant: string[] | undefined }>
}): Promise<Metadata> {
  const { slug, variant } = await params
  const [variantKey] = variant ?? []
  const species = await pokeapi.getPokemonSpeciesByName(slug)
  const pokemon = await pokeapi.getPokemonByName(
    species.varieties.find((v) =>
      variantKey ? v.pokemon.name === variantKey : v.is_default
    )!.pokemon.name
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

  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`
  const name = getTranslation(species.names, 'name')!
  const description = types.map((t) => t.typeName).join('/')

  const metadata: Metadata = {
    title: `${name} #${imageId}`,
    description,
    twitter: {
      card: 'summary',
    },
    openGraph: {
      images: [
        {
          url: imageUrl,
          width: 128,
          height: 128,
          alt: `${name} sprite`,
        },
      ],
    },
  }

  return metadata
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; variant: string[] | undefined }>
}) {
  const { slug, variant } = await params
  const [variantKey] = variant ?? []
  const species = await pokeapi.getPokemonSpeciesByName(slug)
  const pokemon = await pokeapi.getPokemonByName(
    species.varieties.find((v) =>
      variantKey ? v.pokemon.name === variantKey : v.is_default
    )!.pokemon.name
  )
  const forms = (
    await pokeapi.getPokemonFormByName(pokemon.forms.map((form) => form.name))
  ).filter((form) => form.form_names?.length && form.name !== pokemon.name)

  const [eggGroups, growthRate] = await Promise.all([
    pokeapi.getEggGroupByName(
      species?.egg_groups?.map((group) => group.name) || []
    ),
    pokeapi.getGrowthRateByName(species?.growth_rate?.name || ''),
  ])

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Metadata section */}
      <div className="w-full bg-zinc-100 py-6 dark:bg-zinc-900/50">
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 2xl:grid-cols-8">
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
      </div>
      {/* Main details section */}
      <section className="container mx-auto px-4">
        <div className="flex w-full flex-col gap-6 lg:flex-row">
          {/* First column on large screens */}
          <div className="flex w-full flex-col gap-6">
            <Suspense fallback={<LoadingSection />}>
              <StatsSection pokemon={pokemon} />
            </Suspense>
            <Suspense fallback={<LoadingSection />}>
              <TypeEffectivenessSection pokemon={pokemon} />
            </Suspense>
            <Suspense fallback={<LoadingSection />}>
              <AbilitiesSection pokemon={pokemon} />
            </Suspense>
            <Suspense fallback={<LoadingSection />}>
              <EvolutionSection species={species} />
            </Suspense>
            <Suspense fallback={<LoadingSection />}>
              <CosmeticsSection pokemon={pokemon} forms={forms} />
            </Suspense>
            <Suspense fallback={<LoadingSection />}>
              <LocalizationSection species={species} />
            </Suspense>
          </div>
          {/* Second column on large screens */}
          <div className="flex w-full flex-1 flex-col gap-6 md:min-w-xl">
            <Suspense fallback={<LoadingSection />}>
              <MovesSection pokemon={pokemon} />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  )
}
