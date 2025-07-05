import { Metadata } from 'next'
import { Suspense } from 'react'
import pMap from 'p-map'
import type { Pokemon, PokemonForm, PokemonSpecies } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import { getTestSpeciesList } from '@/lib/providers'
import { getTranslation, TypeKey, TypeLabels } from '@/lib/utils/pokeapiHelpers'
import { excludedForms, excludedVariants } from '@/lib/utils/excludedSlugs'
import LoadingSection from '@/components/details/LoadingSection'
import LoadingMetadata from '@/components/details/LoadingMetadata'
import MonsterMetadata from '@/components/details/MonsterMetadata'
import StatsSection from '@/components/details/stats/StatsSection'
import TypeEffectivenessSection from '@/components/details/typeEffectiveness/TypeEffectivenessSection'
import AbilitiesSection from '@/components/details/abilities/AbilitiesSection'
import EvolutionSection from '@/components/details/evolution/EvolutionSection'
import CosmeticsSection from '@/components/details/cosmetics/CosmeticsSection'
import LocalizationSection from '@/components/details/localization/LocalizationSection'
import MovesSection from '@/components/details/moves/MovesSection'

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  const speciesList =
    process?.env?.NODE_ENV && process?.env?.NODE_ENV === 'development'
      ? await getTestSpeciesList()
      : await pokeapi.getList('pokemon-species', 1025, 0)

  const species = await pMap(
    speciesList.results,
    async (result) => await pokeapi.getResource<PokemonSpecies>(result.url),
    { concurrency: 4 }
  )

  const params = species.flatMap((specie) =>
    specie.varieties
      .filter((variant) => !excludedVariants.includes(variant.pokemon.name))
      .map((variant) => ({
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
  const species = await pokeapi.getByName<PokemonSpecies>(
    'pokemon-species',
    slug
  )
  const pokemonUrl = species.varieties
    .filter((variant) => !excludedVariants.includes(variant.name))
    .find((v) => (variantKey ? v.pokemon.name === variantKey : v.is_default))!
    .pokemon.url
  const pokemon = await pokeapi.getResource<Pokemon>(pokemonUrl)

  const imageId = species.id.toString().padStart(4, '0')
  // const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`
  const imageUrl = `https://raw.githubusercontent.com/blai30/PokemonSpritesDump/refs/heads/main/sprites/sprite_${imageId}_s0.webp`
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
  const species = await pokeapi.getByName<PokemonSpecies>(
    'pokemon-species',
    slug
  )
  const pokemonUrl = species.varieties
    .filter((variant) => !excludedVariants.includes(variant.name))
    .find((v) => (variantKey ? v.pokemon.name === variantKey : v.is_default))!
    .pokemon.url
  const pokemon = await pokeapi.getResource<Pokemon>(pokemonUrl)

  const forms = await pMap(
    pokemon.forms.filter(
      (form) => form.name !== pokemon.name && !excludedForms.includes(form.name)
    ),
    async (form) =>
      await pokeapi.getByName<PokemonForm>('pokemon-form', form.name),
    { concurrency: 4 }
  )

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Metadata section */}
      <div className="w-full bg-zinc-100 py-6 dark:bg-zinc-900/50">
        <section className="mx-auto w-full max-w-[96rem] px-4">
          <Suspense fallback={<LoadingMetadata />}>
            <MonsterMetadata species={species} pokemon={pokemon} />
          </Suspense>
        </section>
      </div>
      {/* Main details section */}
      <section className="mx-auto w-full max-w-[96rem] px-4">
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
