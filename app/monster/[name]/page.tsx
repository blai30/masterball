import { Metadata } from 'next'
import Image from 'next/image'
import { pokeapi } from '@/lib/providers'
import { typeIconUrl, typeClasses } from '@/lib/utils'
import MonsterMetadata from '@/components/MonsterMetadata'

export async function generateStaticParams() {
  const speciesList = await pokeapi.getPokemonSpeciesList({
    limit: 30,
    offset: 730,
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
  const translatedName = species.names.filter(
    (nameResource) => nameResource.language.name === language
  )[0].name

  return {
    title: `${imageId} - ${translatedName}`,
    description: `${typeNames.join(' ')}`,
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
          <div className="flex flex-row items-baseline gap-4">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl dark:text-white">
              {
                species.names.filter(
                  (nameResource) => nameResource.language.name === language
                )[0].name
              }
            </h1>
            <ul className="flex flex-row gap-2">
              {types.map((typeResource) => {
                const typeNames = typeResource.names.filter(
                  (name) => name.language.name === language
                )
                return typeNames.map((name) => (
                  <li
                    key={typeResource.id}
                    className={[
                      'flex w-28 flex-row items-center gap-1 rounded-full px-1',
                      typeClasses[typeResource.name],
                    ].join(' ')}
                  >
                    <Image
                      key={typeResource.id}
                      src={typeIconUrl(typeResource.name)}
                      alt={typeResource.name}
                      width={20}
                      height={20}
                      className={[
                        'aspect-square object-contain',
                        'bg-transparent',
                      ].join(' ')}
                    />
                    <p className="">{name.name}</p>
                  </li>
                ))
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Metadata */}
      <MonsterMetadata />

      {/* Main details */}
      <div className="">
        <dl className="">
          <section className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-lg font-medium text-white">Stats</dt>
            <dd className="text-lg text-zinc-400 sm:col-span-2">
              For Individuals Started Out With Design Freatures
            </dd>
          </section>
          <section className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-lg font-medium text-white">
              Type Effectiveness
            </dt>
            <dd className="text-lg text-zinc-400 sm:col-span-2">Enterpise</dd>
          </section>
          <section className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-lg font-medium text-white">Abilities</dt>
            <dd className="text-lg text-zinc-400 sm:col-span-2">
              Current Plans
            </dd>
          </section>
          <section className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-lg font-medium text-white">Evolution</dt>
            <dd className="text-lg text-zinc-400 sm:col-span-2">
              Freatures Like A Free
            </dd>
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
            <dd className="text-lg text-zinc-400 sm:col-span-2">jagger</dd>
          </section>
        </dl>
      </div>
    </div>
  )
}
