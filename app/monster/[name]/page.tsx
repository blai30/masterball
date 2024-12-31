import { Metadata } from 'next'
import Image from 'next/image'
import { pokeapi } from '@/lib/providers'

export async function generateStaticParams() {
  const speciesList = await pokeapi.getPokemonSpeciesList({
    limit: 50,
    offset: 251,
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
  const types = await pokeapi.getTypeByName(
    pokemon.types.map((type) => type.type.name)
  )
  const typeNames = types.map((t) => {
    const filtered = t.names.filter((n) => n.language.name === language)
    return filtered.map((v) => v.name)
  })

  const imageId = pokemon.id.toString().padStart(4, '0')

  return {
    title: species.names.filter(
      (nameResource) => nameResource.language.name === language
    )[0].name,
    description: `#${species.id.toString()}\n${typeNames.join(' ')}`,
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
  const language = 'en'
  const { name } = await params
  const species = await pokeapi.getPokemonSpeciesByName(name)
  const pokemon = await pokeapi.getPokemonByName(
    species.varieties[0].pokemon.name
  )
  const types = await pokeapi.getTypeByName(
    pokemon.types.map((type) => type.type.name)
  )

  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  const leadingZeros = imageId.match(/^0+/)?.[0] || ''
  const significantDigits = imageId.slice(leadingZeros.length)

  return (
    <div className="container mx-auto flex flex-col gap-8">
      {/* Hero section */}
      <section className="flex flex-row items-end gap-4 sm:p-4 md:gap-8 md:p-12">
        <Image
          src={imageUrl}
          alt={species.name}
          width={128}
          height={128}
          priority
          className="h-full object-scale-down"
        />
        <div className="flex flex-col items-start gap-4">
          <h2 className="relative font-mono text-3xl">
            <span className="text-zinc-400 dark:text-zinc-600">
              {leadingZeros}
            </span>
            <span className="text-black dark:text-white">
              {significantDigits}
            </span>
          </h2>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl dark:text-white">
            {
              species.names.filter(
                (nameResource) => nameResource.language.name === language
              )[0].name
            }
          </h1>
        </div>
      </section>

      {/* Metadata */}
      <section className="grid grid-cols-2 gap-x-4 gap-y-6 px-4 sm:grid-cols-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm/6 text-zinc-400">Gender ratio</p>
          <div className="flex flex-col">
            <p className="flex items-baseline gap-x-2">
              <span className="text-base font-light text-white">
                69.5%
              </span>
              <span className="text-base text-zinc-400">♂️</span>
            </p>
            <p className="flex items-baseline gap-x-2">
              <span className="text-base font-light text-white">
                30.5%
              </span>
              <span className="text-base text-zinc-400">♀️</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm/6 text-zinc-400">Catch rate</p>
          <div className="flex flex-col">
            <p className="flex items-baseline gap-x-2">
              <span className="text-base font-light text-white">
                45
              </span>
              <span className="text-base text-zinc-400">/ 255</span>
            </p>
            <p className="flex items-baseline gap-x-2">
              <span className="text-base font-light text-white">
                {((45 / 255) * 100).toFixed(2)}
              </span>
              <span className="text-base text-zinc-400">%</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm/6 text-zinc-400">Height</p>
          <div className="flex flex-col">
            <p className="flex items-baseline gap-x-2">
              <span className="text-base font-light text-white">
                {'4 ft 11 in'}
              </span>
            </p>
            <p className="flex items-baseline gap-x-2">
              <span className="text-base font-light text-white">
                1.5
              </span>
              <span className="text-base text-zinc-400">meters</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm/6 text-zinc-400">Weight</p>
          <div className="flex flex-col">
            <p className="flex items-baseline gap-x-2">
              <span className="text-base font-light text-white">
                180.6
              </span>
              <span className="text-base text-zinc-400">lbs</span>
            </p>
            <p className="flex items-baseline gap-x-2">
              <span className="text-base font-light text-white">
                81.9
              </span>
              <span className="text-base text-zinc-400">kg</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm/6 text-zinc-400">Egg steps</p>
          <div className="flex flex-col">
            <p className="flex items-baseline gap-x-2">
              <span className="text-base font-light text-white">
                {(2560).toLocaleString()}
              </span>
              <span className="text-base text-zinc-400">steps</span>
            </p>
            <p className="flex items-baseline gap-x-2">
              <span className="text-base font-light text-white">
                {(20).toLocaleString()}
              </span>
              <span className="text-base text-zinc-400">cycles</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm/6 text-zinc-400">Egg group</p>
          <div className="flex flex-col">
            <p className="flex items-baseline gap-x-2">
              <span className="text-base font-light text-white">
                Monster
              </span>
            </p>
            <p className="flex items-baseline gap-x-2">
              <span className="text-base font-light text-white">
                Water 1
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm/6 text-zinc-400">Experience Growth</p>
          <div className="flex flex-col">
            <p className="flex items-baseline gap-x-2">
              <span className="text-base font-light text-white">
                {(1059862).toLocaleString()}
              </span>
              <span className="text-base text-zinc-400">points</span>
            </p>
            <p className="flex items-baseline gap-x-2">
              <span className="text-base font-light text-white">
                Medium Slow
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm/6 text-zinc-400">Effort Value yield</p>
          <div className="flex flex-col">
            <p className="flex items-baseline gap-x-2">
              <span className="text-base font-light text-white">
                {(3).toLocaleString()}
              </span>
              <span className="text-base text-zinc-400">Attack</span>
            </p>
            <p className="flex items-baseline gap-x-2">
              <span className="text-base font-light text-white">
                {'that\'s it'}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Main details */}
      <div className="">
        <dl className="">
          <section className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-lg font-medium text-white">Weaknesses</dt>
            <dd className="text-lg text-zinc-400 sm:col-span-2">
              Margot Foster
            </dd>
          </section>
          <section className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-lg font-medium text-white">Abilities</dt>
            <dd className="text-lg text-zinc-400 sm:col-span-2">
              Backend Developer
            </dd>
          </section>
          <section className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-lg font-medium text-white">Stats</dt>
            <dd className="text-lg text-zinc-400 sm:col-span-2">
              margotfoster@example.com
            </dd>
          </section>
          <section className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-lg font-medium text-white">Evolution</dt>
            <dd className="text-lg text-zinc-400 sm:col-span-2">$120,000</dd>
          </section>
          <section className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-lg font-medium text-white">About</dt>
            <dd className="text-lg text-zinc-400 sm:col-span-2">
              Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
              incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
              consequat sint. Sit id mollit nulla mollit nostrud in ea officia
              proident. Irure nostrud pariatur mollit ad adipisicing
              reprehenderit deserunt qui eu.
            </dd>
          </section>
          <section className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-lg font-medium text-white">Moves</dt>
          </section>
        </dl>
      </div>
    </div>
  )
}
