'use client'

import Image from 'next/image'
import { Pokemon, PokemonSpecies, Type } from 'pokedex-promise-v2'
import { typeIconUrl, typeClasses } from '@/lib/utils'

export default function MonsterHero({
  species,
  pokemon,
  typeResources,
}: {
  species: PokemonSpecies
  pokemon: Pokemon
  typeResources: Type[]
}) {
  const language = 'en'
  const name = species.names.filter(
    (nameResource) => nameResource.language.name === language
  )[0].name

  const types = typeResources.map((resource) => {
    const typeName = resource.names.find((n) => n.language.name === language)!
    return {
      id: resource.id,
      key: resource.name,
      name: typeName.name,
    }
  })

  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  const leadingZeros = imageId.match(/^0+/)?.[0] || ''
  const significantDigits = imageId.slice(leadingZeros.length)

  return (
    <section className="flex flex-col items-start lg:gap-8 p-4 lg:flex-row lg:items-end">
      <div className="flex flex-col items-start gap-4">
        <h2 className="relative font-mono text-2xl sm:text-3xl">
          <span className="text-zinc-400 dark:text-zinc-600">
            {leadingZeros}
          </span>
          <span className="text-black dark:text-white">
            {significantDigits}
          </span>
        </h2>
        <div className="flex flex-col items-start gap-6">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight md:text-6xl dark:text-white">
            {name}
          </h1>
          <ul className="flex flex-row gap-2">
            {types.map((type) => (
              <li
                key={type.id}
                className={[
                  'flex w-28 flex-row gap-1 rounded-full px-1',
                  typeClasses[type.key],
                ].join(' ')}
              >
                <Image
                  key={type.id}
                  src={typeIconUrl(type.key)}
                  alt={type.key}
                  width={20}
                  height={20}
                  className={[
                    'aspect-square object-contain',
                    'bg-transparent',
                  ].join(' ')}
                />
                <p className="font-medium text-white uppercase">{type.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-row gap-6">
        <Image
          src={pokemon.sprites.other.home.front_default!}
          alt={species.name}
          width={200}
          height={200}
          priority
          className="h-32 object-scale-down sm:h-40 md:h-52"
        />
        <Image
          src={pokemon.sprites.other.home.front_shiny!}
          alt={species.name}
          width={200}
          height={200}
          priority
          className="h-32 object-scale-down sm:h-40 md:h-52"
        />
      </div>
    </section>
  )
}
