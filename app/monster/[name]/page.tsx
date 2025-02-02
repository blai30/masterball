import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { EvolutionChain } from 'pokedex-promise-v2'
import { getMockSpeciesList, pokeapi } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import MonsterHero from '@/components/MonsterHero'
import LoadingSection from '@/components/details/LoadingSection'
import StatsSection from '@/components/details/stats/StatsSection'
import TypeEffectivenessSection from '@/components/details/typeEffectiveness/TypeEffectivenessSection'
import AbilitiesSection from '@/components/details/abilities/AbilitiesSection'
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

  const speciesList = await getMockSpeciesList()

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
      typeName,
    }
  })

  const imageId = pokemon.id.toString().padStart(4, '0')
  const translatedName = getTranslation(species.names, 'name')

  return {
    title: `${translatedName} - ${imageId}`,
    description: `${types.map((t) => t.typeName).join(' ')}`,
    openGraph: {
      images: [
        {
          url: `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`,
          width: 128,
          height: 128,
          alt: species.name,
        },
      ],
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const species = await pokeapi.getPokemonSpeciesByName(name)
  const evolutionChain: EvolutionChain = await pokeapi.getResource(
    species.evolution_chain.url
  )
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
                    {(3).toLocaleString()}
                  </span>
                  <span className="text-base text-zinc-600 dark:text-zinc-400">
                    Attack
                  </span>
                </p>
                <p className="flex gap-x-1">
                  <span className="text-base font-light text-black dark:text-white">
                    {"that's it"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="w-full flex flex-col lg:flex-row lg:grow">
          {/* First column on large screens */}
          <div className="flex flex-col gap-4 w-full">
            <Suspense fallback={<LoadingSection />}>
              <StatsSection pokemon={pokemon} />
            </Suspense>
            <Suspense fallback={<LoadingSection />}>
              <TypeEffectivenessSection pokemon={pokemon} />
            </Suspense>
            <Suspense fallback={<LoadingSection />}>
              <AbilitiesSection pokemon={pokemon} />
            </Suspense>
            <section className="flex flex-col gap-4 px-4 py-6">
              <h2 className="text-xl font-medium text-black dark:text-white">
                Evolution
              </h2>
              <ul className="flex flex-col gap-4">
                {evolutionChain.chain.evolves_to.map((evolution) => (
                  <li key={evolution.species.name}>
                    <Link
                      href={`/monster/${evolution.species.name}`}
                      className="inline-block"
                    >
                      <span className="text-blue-700 underline dark:text-blue-300">
                        {evolution.species.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          {/* Second column on large screens */}
          <div className="flex flex-col gap-4 lg:min-w-2xl w-full">
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
