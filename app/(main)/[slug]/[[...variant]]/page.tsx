import { Metadata } from 'next'
import { Suspense } from 'react'
import pMap from 'p-map'
import type {
  EggGroup,
  GrowthRate,
  NamedAPIResourceList,
  Pokemon,
  PokemonForm,
  PokemonSpecies,
} from 'pokedex-promise-v2'
import { getTestSpeciesList } from '@/lib/providers'
import { getTranslation, TypeKey, TypeLabels } from '@/lib/utils/pokeapiHelpers'
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
      : await fetch(
          'https://pokeapi.co/api/v2/pokemon-species?limit=1025&offset=0'
        ).then((response) => response.json() as Promise<NamedAPIResourceList>)
  // : await pokeapi.getPokemonSpeciesList({
  //     limit: 1025,
  //     offset: 0,
  //   })

  // const species = (await pokeapi.getResource(
  //   speciesList.results.map((result) => result.url)
  // )) as PokemonSpecies[]
  const species = await pMap(
    speciesList.results,
    async (result) => {
      const species = await fetch(result.url).then(
        (response) => response.json() as Promise<PokemonSpecies>
      )
      return species
    },
    { concurrency: 4 }
  )

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
  // const species = await pokeapi.getPokemonSpeciesByName(slug)
  // const pokemon = await pokeapi.getPokemonByName(
  //   species.varieties.find((v) =>
  //     variantKey ? v.pokemon.name === variantKey : v.is_default
  //   )!.pokemon.name
  // )
  const species = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${slug}`
  ).then((response) => response.json() as Promise<PokemonSpecies>)
  const pokemonUrl = species.varieties.find((v) =>
    variantKey ? v.pokemon.name === variantKey : v.is_default
  )!.pokemon.url
  const pokemon = await fetch(pokemonUrl).then(
    (response) => response.json() as Promise<Pokemon>
  )
  // const typeResources = await pokeapi.getTypeByName(
  //   pokemon.types.map((type) => type.type.name)
  // )

  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`
  const name = getTranslation(species.names, 'name')!
  const description = pokemon.types
    .map((t) => TypeLabels[t.type.name as TypeKey])
    .join('/')

  const metadata: Metadata = {
    title: `${name} #${imageId}`,
    description,
    twitter: {
      card: 'summary',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: 'Masterball',
      url: process.env.NEXT_PUBLIC_FULL_URL,
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
  // const species = await pokeapi.getPokemonSpeciesByName(slug)
  // const pokemon = await pokeapi.getPokemonByName(
  //   species.varieties.find((v) =>
  //     variantKey ? v.pokemon.name === variantKey : v.is_default
  //   )!.pokemon.name
  // )
  const species = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${slug}`
  ).then((response) => response.json() as Promise<PokemonSpecies>)
  const pokemonUrl = species.varieties.find((v) =>
    variantKey ? v.pokemon.name === variantKey : v.is_default
  )!.pokemon.url
  const pokemon = await fetch(pokemonUrl).then(
    (response) => response.json() as Promise<Pokemon>
  )
  // const forms = (
  //   await pokeapi.getPokemonFormByName(pokemon.forms.map((form) => form.name))
  // ).filter((form) => form.form_names?.length && form.name !== pokemon.name)

  // const [eggGroups, growthRate] = await Promise.all([
  //   pokeapi.getEggGroupByName(
  //     species?.egg_groups?.map((group) => group.name) || []
  //   ),
  //   pokeapi.getGrowthRateByName(species?.growth_rate?.name || ''),
  // ])

  const forms = await pMap(
    pokemon.forms,
    async (form) => {
      const formData = await fetch(form.url).then(
        (response) => response.json() as Promise<PokemonForm>
      )
      return formData
    },
    { concurrency: 4 }
  )

  const eggGroups = await pMap(
    species.egg_groups,
    async (group) => {
      const groupData = await fetch(group.url).then(
        (response) => response.json() as Promise<EggGroup>
      )
      return groupData
    },
    { concurrency: 4 }
  )
  const growthRate = await fetch(species.growth_rate.url).then(
    (response) => response.json() as Promise<GrowthRate>
  )

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
        <div className="flex w-full flex-col gap-6 xl:flex-row">
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
            {forms?.length > 0 && (
              <Suspense fallback={<LoadingSection />}>
                <CosmeticsSection pokemon={pokemon} forms={forms} />
              </Suspense>
            )}
            <Suspense fallback={<LoadingSection />}>
              <LocalizationSection species={species} />
            </Suspense>
          </div>
          {/* Second column on large screens */}
          <div className="flex w-full flex-col gap-6">
            <Suspense fallback={<LoadingSection />}>
              <MovesSection pokemon={pokemon} />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  )
}
