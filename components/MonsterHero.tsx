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
            {types.map((type) => (
              <li
                key={type.id}
                className={[
                  'flex w-28 flex-row items-center gap-1 rounded-full px-1',
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
    </section>
  )
}
