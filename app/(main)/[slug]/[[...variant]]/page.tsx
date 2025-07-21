import { Metadata } from 'next'
import { Suspense } from 'react'
import type { Pokemon, PokemonForm, PokemonSpecies } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import dataService from '@/lib/services/dataService'
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
import MonsterHero from '@/components/details/MonsterHero'

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  // Use the shared data service to avoid duplicate fetching
  return dataService.getStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; variant: string[] | undefined }>
}): Promise<Metadata> {
  const { slug, variant } = await params
  const [variantKey] = variant ?? []
  
  // Try to get from cached data first
  let species = await dataService.getSpeciesByName(slug)
  if (!species) {
    // Fallback to API if not in cache
    species = await pokeapi.getByName<PokemonSpecies>('pokemon-species', slug)
  }
  
  const pokemonUrl = species.varieties
    .filter((variant) => !excludedVariants.includes(variant.pokemon.name))
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
  
  // Try to get from cached data first
  let species = await dataService.getSpeciesByName(slug)
  if (!species) {
    // Fallback to API if not in cache
    species = await pokeapi.getByName<PokemonSpecies>('pokemon-species', slug)
  }
  
  const pokemonUrl = species.varieties
    .filter((variant) => !excludedVariants.includes(variant.pokemon.name))
    .find((v) => (variantKey ? v.pokemon.name === variantKey : v.is_default))!
    .pokemon.url
  const pokemon = await pokeapi.getResource<Pokemon>(pokemonUrl)

  const forms = await pokeapi.batchFetchAndTransform(
    pokemon.forms.filter((form) => !excludedForms.includes(form.name)),
    async (form) => {
      return pokeapi.getByName<PokemonForm>('pokemon-form', form.name)
    },
    8 // Increased concurrency
  )

  const form =
    pokemon.is_default || species.name === pokemon.name
      ? undefined
      : forms.find((f) => f.name === variantKey || f.name === pokemon.name)

  return (
    <div className="flex w-full flex-col gap-4 xl:max-w-none">
      {/* <section className="mx-auto w-full max-w-[96rem]">
        <MonsterHero species={species} pokemon={pokemon} form={form} />
      </section>
      <section className="@container mx-auto w-full max-w-[96rem]">
        <Suspense fallback={<LoadingMetadata />}>
          <MonsterMetadata species={species} pokemon={pokemon} />
        </Suspense>
      </section> */}
      <section className="@container mx-auto w-full max-w-[96rem]">
        <div className="grid grid-cols-2 gap-4 @3xl:grid-cols-4 @[88rem]:grid-cols-8">
          <MonsterHero
            species={species}
            pokemon={pokemon}
            form={form}
            className="col-span-2"
          />
          <Suspense fallback={<LoadingMetadata />}>
            <MonsterMetadata species={species} pokemon={pokemon} />
          </Suspense>
        </div>
      </section>
      {/* Main details section */}
      <section className="mx-auto w-full max-w-[96rem]">
        <div className="flex w-full flex-col gap-4 xl:flex-row">
          {/* First column on large screens */}
          <div className="flex w-full flex-col gap-4">
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
            {forms?.length > 1 && (
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
