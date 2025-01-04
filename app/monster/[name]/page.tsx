import { Metadata } from 'next'
import Link from 'next/link'
import { EvolutionChain, Type } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import MonsterHero from '@/components/MonsterHero'
import FlavorText from '@/components/details/FlavorText'
import HeightMetadata from '@/components/metadata/HeightMetadata'
import WeightMetadata from '@/components/metadata/WeightMetadata'
import GenderRatioMetadata from '@/components/metadata/GenderRatioMetadata'
import CaptureRateMetadata from '@/components/metadata/CaptureRateMetadata'
import HatchCounterMetadata from '@/components/metadata/HatchCounterMetadata'
import EggGroupMetadata from '@/components/metadata/EggGroupMetadata'
import GrowthRateMetadata from '@/components/metadata/GrowthRateMetadata'

const calculateEffectiveness = (
  typeResources: Type[]
): Record<string, number> => {
  // Initialize empty effectiveness object.
  const effectiveness: Record<string, number> = {}
  const allTypes = [
    'normal',
    'fighting',
    'flying',
    'poison',
    'ground',
    'rock',
    'bug',
    'ghost',
    'steel',
    'fire',
    'water',
    'grass',
    'electric',
    'psychic',
    'ice',
    'dragon',
    'dark',
    'fairy',
  ]

  // Process each defending type's relations.
  typeResources.forEach((type) => {
    // Handle immunities first (these override everything).
    type.damage_relations.no_damage_from.forEach((t) => {
      effectiveness[t.name] = 0
    })

    // Process resistances.
    type.damage_relations.half_damage_from.forEach((t) => {
      if (effectiveness[t.name] !== 0) {
        // Skip if immune.
        effectiveness[t.name] = (effectiveness[t.name] || 1) * 0.5
      }
    })

    // Process weaknesses.
    type.damage_relations.double_damage_from.forEach((t) => {
      if (effectiveness[t.name] !== 0) {
        // Skip if immune.
        effectiveness[t.name] = (effectiveness[t.name] || 1) * 2
      }
    })

    // Include the rest of the types.
    allTypes.forEach((t) => {
      if (effectiveness[t] === undefined) {
        effectiveness[t] = 1
      }
    })
  })

  return effectiveness
}

export async function generateStaticParams() {
  const speciesList = await pokeapi.getPokemonSpeciesList({
    limit: 20,
    offset: 721,
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
  const typeResources = await pokeapi.getTypeByName(
    pokemon.types.map((type) => type.type.name)
  )
  const eggGroups = await pokeapi.getEggGroupByName(
    species.egg_groups.map((group) => group.name)
  )
  const growthRate = await pokeapi.getGrowthRateByName(species.growth_rate.name)

  const typeEffectiveness = calculateEffectiveness(typeResources)

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
            <dl className="">
              <section className="px-4 py-6 sm:gap-4">
                <dt className="text-lg font-medium text-black dark:text-white">
                  Stats
                </dt>
                <dd className="text-lg text-zinc-600 sm:col-span-2 dark:text-zinc-400">
                  {pokemon.stats.map((stat) => (
                    <p key={stat.stat.name}>
                      <Link href={stat.stat.url}>
                        <span className="text-blue-700 underline dark:text-blue-300">
                          {stat.stat.name}
                        </span>
                      </Link>
                      <span>: {stat.base_stat.toLocaleString()}</span>
                    </p>
                  ))}
                </dd>
              </section>
              <section className="px-4 py-6 sm:gap-4">
                <dt className="text-lg font-medium text-black dark:text-white">
                  Type Effectiveness
                </dt>
                <dd className="text-lg text-zinc-600 sm:col-span-2 dark:text-zinc-400">
                  <ul>
                    {Object.entries(typeEffectiveness)
                      .sort((a, b) => b[1] - a[1])
                      .map(([type, multiplier]) => (
                        <li
                          key={type}
                          className="flex items-center justify-between"
                        >
                          <span>{type}</span>
                          <span
                            className={`font-mono ${
                              multiplier > 1
                                ? 'text-green-800 dark:text-green-200'
                                : multiplier === 1
                                  ? 'text-black dark:text-white'
                                  : multiplier === 0
                                    ? 'text-purple-800 dark:text-purple-200'
                                    : 'text-red-800 dark:text-red-200'
                            }`}
                          >
                            {`${multiplier.toFixed(2)}×`}
                          </span>
                        </li>
                      ))}
                  </ul>
                </dd>
              </section>
              <section className="px-4 py-6 sm:gap-4">
                <dt className="text-lg font-medium text-black dark:text-white">
                  Abilities
                </dt>
                <dd className="text-lg text-zinc-600 sm:col-span-2 dark:text-zinc-400">
                  {pokemon.abilities.map((ability) => (
                    <p key={ability.slot}>
                      <Link href={ability.ability.url}>
                        <span className="text-blue-700 underline dark:text-blue-300">
                          {ability.ability.name}
                        </span>
                      </Link>
                    </p>
                  ))}
                </dd>
              </section>
              <section className="px-4 py-6 sm:gap-4">
                <dt className="text-lg font-medium text-black dark:text-white">
                  Evolution
                </dt>
                <dd className="text-lg text-zinc-600 sm:col-span-2 dark:text-zinc-400">
                  <Link href={`/monster/${evolutionChain.chain.species.name}`}>
                    <span className="text-blue-700 underline dark:text-blue-300">
                      {evolutionChain.chain.species.name}
                    </span>
                  </Link>
                </dd>
              </section>
              <FlavorText species={species} />
              <section className="px-4 py-6 sm:gap-4">
                <dt className="text-lg font-medium text-black dark:text-white">
                  Moves
                </dt>
                <dd className="text-lg text-zinc-600 sm:col-span-2 dark:text-zinc-400">
                  {pokemon.moves.map((move) => move.move.name).join(', ')}
                </dd>
              </section>
            </dl>
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
