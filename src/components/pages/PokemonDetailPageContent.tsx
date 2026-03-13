import { Suspense } from 'react'
import type { Pokemon, PokemonForm, PokemonSpecies } from 'pokedex-promise-v2'
import AppShell from '@/components/AppShell'
import VariantCardSelector from '@/components/compounds/VariantCardSelector'
import MonsterHero from '@/components/details/MonsterHero'
import MonsterMetadata from '@/components/details/MonsterMetadata'
import StatsSection from '@/components/details/stats/StatsSection'
import TypeEffectivenessSection from '@/components/details/typeEffectiveness/TypeEffectivenessSection'
import AbilitiesSection, {
  type AbilitySectionData,
} from '@/components/details/abilities/AbilitiesSection'
import EvolutionSection, {
  type EvolutionNodeData,
} from '@/components/details/evolution/EvolutionSection'
import CosmeticsSection from '@/components/details/cosmetics/CosmeticsSection'
import LocalizationSection from '@/components/details/localization/LocalizationSection'
import MovesSection from '@/components/details/moves/MovesSection'
import LoadingSection from '@/components/details/LoadingSection'
import LoadingMetadata from '@/components/details/LoadingMetadata'
import type {
  Monster,
  TypeRelation,
  LearnMethodKey,
  MoveRow,
} from '@/lib/utils/pokeapi-helpers'
import type { EggGroup, GrowthRate } from 'pokedex-promise-v2'

export type PokemonDetailPageProps = {
  species: PokemonSpecies
  pokemon: Pokemon
  forms: PokemonForm[]
  form: PokemonForm | undefined
  monsters: Monster[]
  eggGroups: EggGroup[]
  growthRate: GrowthRate
  abilities: AbilitySectionData[]
  allTypeRelations: TypeRelation[]
  evolutionTree: EvolutionNodeData
  moveRowsByMethod: Record<LearnMethodKey, MoveRow[]>
}

export default function PokemonDetailPageContent({
  species,
  pokemon,
  forms,
  form,
  monsters,
  eggGroups,
  growthRate,
  abilities,
  allTypeRelations,
  evolutionTree,
  moveRowsByMethod,
}: PokemonDetailPageProps) {
  return (
    <AppShell>
      <div className="flex w-full flex-1 flex-col gap-6">
        <div className="grow">
          <div className="mx-auto max-w-[96rem]">
            <div className="flex overflow-x-auto">
              <div className="@container grow">
                <VariantCardSelector
                  monsters={monsters}
                  className="min-w-full justify-center-safe whitespace-nowrap"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 xl:max-w-none">
          <section className="@container mx-auto w-full max-w-[96rem]">
            <div className="grid grid-cols-2 gap-4 @3xl:grid-cols-4 @[88rem]:grid-cols-8">
              <MonsterHero
                species={species}
                pokemon={pokemon}
                form={form}
                className="col-span-2"
              />
              <Suspense fallback={<LoadingMetadata />}>
                <MonsterMetadata
                  species={species}
                  pokemon={pokemon}
                  eggGroups={eggGroups}
                  growthRate={growthRate}
                />
              </Suspense>
            </div>
          </section>
          <section className="mx-auto w-full max-w-[96rem]">
            <div className="flex w-full flex-col gap-4 xl:flex-row">
              <div className="flex w-full flex-col gap-4">
                <Suspense fallback={<LoadingSection />}>
                  <StatsSection pokemon={pokemon} />
                </Suspense>
                <Suspense fallback={<LoadingSection />}>
                  <TypeEffectivenessSection allTypeRelations={allTypeRelations} />
                </Suspense>
                <Suspense fallback={<LoadingSection />}>
                  <AbilitiesSection abilities={abilities} />
                </Suspense>
                <Suspense fallback={<LoadingSection />}>
                  <EvolutionSection tree={evolutionTree} />
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
              <div className="flex w-full flex-col gap-6">
                <Suspense fallback={<LoadingSection />}>
                  <MovesSection moveRowsByMethod={moveRowsByMethod} />
                </Suspense>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  )
}
