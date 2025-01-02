import { Metadata } from 'next'
import { pokeapi } from '@/lib/providers'
import MonsterMetadata from '@/components/MonsterMetadata'
import MonsterHero from '@/components/MonsterHero'
import { EvolutionChain, Type } from 'pokedex-promise-v2'

export function calculateEffectiveness(
  typeResources: Type[]
): Record<string, number> {
  // Initialize empty effectiveness object
  const effectiveness: Record<string, number> = {}

  // Process each defending type's relations
  typeResources.forEach((type) => {
    // Handle immunities first (these override everything)
    type.damage_relations.no_damage_from.forEach((t) => {
      effectiveness[t.name] = 0
    })

    // Process resistances
    type.damage_relations.half_damage_from.forEach((t) => {
      if (effectiveness[t.name] !== 0) {
        // Skip if immune
        effectiveness[t.name] = (effectiveness[t.name] || 1) * 0.5
      }
    })

    // Process weaknesses
    type.damage_relations.double_damage_from.forEach((t) => {
      if (effectiveness[t.name] !== 0) {
        // Skip if immune
        effectiveness[t.name] = (effectiveness[t.name] || 1) * 2
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
    title: `${imageId} - ${translatedName}`,
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
  const evYield = await pokeapi.getStatByName(
    pokemon.stats
      .filter((stat) => stat.effort !== 0)
      .map((stat) => stat.stat.name)
  )

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
                      {stat.stat.name}: {stat.base_stat.toLocaleString()}
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
                      .filter(([_, value]) => value !== 1)
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
                                : multiplier === 0
                                  ? 'text-purple-800 dark:text-purple-200'
                                  : 'text-red-800 dark:text-red-200'
                            }`}
                          >
                            {`${multiplier.toFixed(1)}×`}
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
                    <p key={ability.slot}>{ability.ability.name}</p>
                  ))}
                </dd>
              </section>
              <section className="px-4 py-6 sm:gap-4">
                <dt className="text-lg font-medium text-black dark:text-white">
                  Evolution
                </dt>
                <dd className="text-lg text-zinc-600 sm:col-span-2 dark:text-zinc-400">
                  {evolutionChain.chain.species.name}
                </dd>
              </section>
              <section className="px-4 py-6 sm:gap-4">
                <dt className="text-lg font-medium text-black dark:text-white">
                  About
                </dt>
                <dd className="text-lg text-zinc-600 sm:col-span-2 dark:text-zinc-400">
                  {
                    species.flavor_text_entries.find(
                      (e) => e.language.name === 'en'
                    )!.flavor_text
                  }
                </dd>
              </section>
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

        <div className="order-first flex flex-col gap-8 xl:order-last xl:col-span-1">
          {/* Metadata */}
          <MonsterMetadata
            height={pokemon.height}
            weight={pokemon.weight}
            genderRate={species.gender_rate}
            captureRate={species.capture_rate}
            hatchCounter={species.hatch_counter!}
            eggGroups={eggGroups}
            growthRate={growthRate}
            effortValueYield={evYield}
          />
        </div>
      </div>
    </div>
  )
}
