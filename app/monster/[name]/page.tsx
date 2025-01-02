import { Metadata } from 'next'
import { pokeapi } from '@/lib/providers'
import MonsterMetadata from '@/components/MonsterMetadata'
import MonsterHero from '@/components/MonsterHero'

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

  return (
    <div className="container mx-auto">
      <div className="w-full">
        {/* Hero section */}
        <MonsterHero
          species={species}
          pokemon={pokemon}
          typeResources={typeResources}
        />
      </div>
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {/* Main details */}
          <div className="">
            <dl className="">
              <section className="px-4 py-6 sm:gap-4">
                <dt className="text-lg font-medium text-black dark:text-white">
                  Stats
                </dt>
                <dd className="text-lg text-zinc-600 sm:col-span-2 dark:text-zinc-400">
                  For Individuals Started Out With Design Freatures
                </dd>
              </section>
              <section className="px-4 py-6 sm:gap-4">
                <dt className="text-lg font-medium text-black dark:text-white">
                  Type Effectiveness
                </dt>
                <dd className="text-lg text-zinc-600 sm:col-span-2 dark:text-zinc-400">
                  Enterpise
                </dd>
              </section>
              <section className="px-4 py-6 sm:gap-4">
                <dt className="text-lg font-medium text-black dark:text-white">
                  Abilities
                </dt>
                <dd className="text-lg text-zinc-600 sm:col-span-2 dark:text-zinc-400">
                  Current Plans
                </dd>
              </section>
              <section className="px-4 py-6 sm:gap-4">
                <dt className="text-lg font-medium text-black dark:text-white">
                  Evolution
                </dt>
                <dd className="text-lg text-zinc-600 sm:col-span-2 dark:text-zinc-400">
                  Freatures Like A Free
                </dd>
              </section>
              <section className="px-4 py-6 sm:gap-4">
                <dt className="text-lg font-medium text-black dark:text-white">
                  About
                </dt>
                <dd className="text-lg text-zinc-600 sm:col-span-2 dark:text-zinc-400">
                  Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
                  incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
                  consequat sint. Sit id mollit nulla mollit nostrud in ea
                  officia proident. Irure nostrud pariatur mollit ad adipisicing
                  reprehenderit deserunt qui eu.
                </dd>
              </section>
              <section className="px-4 py-6 sm:gap-4">
                <dt className="text-lg font-medium text-black dark:text-white">
                  Moves
                </dt>
                <dd className="text-lg text-zinc-600 sm:col-span-2 dark:text-zinc-400">
                  jagger
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
