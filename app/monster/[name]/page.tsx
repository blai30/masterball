import { Metadata } from 'next'
import Link from 'next/link'
import { EvolutionChain } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import { TypeName } from '@/lib/utils/pokeapiHelpers'
import MonsterHero from '@/components/MonsterHero'
import Stats from '@/components/details/Stats'
import TypeEffectiveness from '@/components/details/TypeEffectiveness'
import Abilities from '@/components/details/Abilities'
import FlavorText from '@/components/details/FlavorText'
import HeightMetadata from '@/components/metadata/HeightMetadata'
import WeightMetadata from '@/components/metadata/WeightMetadata'
import GenderRatioMetadata from '@/components/metadata/GenderRatioMetadata'
import CaptureRateMetadata from '@/components/metadata/CaptureRateMetadata'
import HatchCounterMetadata from '@/components/metadata/HatchCounterMetadata'
import EggGroupMetadata from '@/components/metadata/EggGroupMetadata'
import GrowthRateMetadata from '@/components/metadata/GrowthRateMetadata'

export async function generateStaticParams() {
  const speciesList = await pokeapi.getPokemonSpeciesList({
    limit: 20,
    offset: 718,
  })

  return speciesList.results.map((result) => ({
    name: result.name,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>
}): Promise<Metadata> {
  const language = 'en'
  const { name } = await params
  const species = await pokeapi.getPokemonSpeciesByName(name)
  const pokemon = await pokeapi.getPokemonByName(
    species.varieties[0].pokemon.name
  )
  const typeResources = await pokeapi.getTypeByName(
    pokemon.types.map((type) => type.type.name)
  )
  const types = typeResources.map((resource) => {
    const typeName = resource.names.find((n) => n.language.name === language)!
    return {
      id: resource.id,
      typeName,
    }
  })

  const imageId = pokemon.id.toString().padStart(4, '0')
  const translatedName = species.names.filter(
    (nameResource) => nameResource.language.name === language
  )[0].name

  return {
    title: `${translatedName} - ${imageId}`,
    description: `${types.map((t) => t.typeName.name).join(' ')}`,
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
    species.varieties[0].pokemon.name
  )
  const stats = await pokeapi.getStatByName(
    pokemon.stats.map((stat) => stat.stat.name)
  )
  const typeResources = await pokeapi.getTypeByName(
    pokemon.types.map((type) => type.type.name)
  )
  const allTypeResources = await pokeapi.getTypeByName(
    Object.values(TypeName).map((t) => t)
  )
  const eggGroups = await pokeapi.getEggGroupByName(
    species.egg_groups.map((group) => group.name)
  )
  const abilities = await pokeapi.getAbilityByName(
    pokemon.abilities.map((ability) => ability.ability.name)
  )
  const growthRate = await pokeapi.getGrowthRateByName(species.growth_rate.name)
  const moves = await pokeapi.getMoveByName(
    pokemon.moves.map((move) => move.move.name)
  )

  return (
    <div className="container mx-auto flex flex-col gap-4 xl:gap-8">
      <div className="w-full">
        {/* Hero section */}
        <MonsterHero
          species={species}
          pokemon={pokemon}
          typeResources={typeResources}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-8">
        <div className="xl:col-span-2">
          {/* Main details */}
          <div className="">
            <Stats pokemon={pokemon} stats={stats} />
            <TypeEffectiveness
              monsterTypes={typeResources}
              allTypes={allTypeResources}
            />
            <Abilities pokemon={pokemon} abilities={abilities} />
            <section className="flex flex-col gap-4 px-4 py-6">
              <h2 className="text-xl font-medium text-black dark:text-white">
                Evolution
              </h2>
              <Link href={`/monster/${evolutionChain.chain.species.name}`}>
                <span className="text-blue-700 underline dark:text-blue-300">
                  {evolutionChain.chain.species.name}
                </span>
              </Link>
            </section>
            <FlavorText species={species} />
            <section className="flex flex-col gap-4 px-4 py-6">
              <h2 className="text-xl font-medium text-black dark:text-white">
                Moves
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                {pokemon.moves.map((move) => move.move.name).join(', ')}
              </p>
            </section>
          </div>
        </div>

        {/* Metadata section */}
        <section className="order-first flex flex-col gap-8 xl:order-last xl:col-span-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2">
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
      </div>
    </div>
  )
}
