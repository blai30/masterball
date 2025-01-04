'use client'

import Image from 'next/image'
import { Pokemon, PokemonSpecies, Type } from 'pokedex-promise-v2'
import TypePill from './TypePill'
import { useLanguage } from './LanguageContext'

export default function MonsterHero({
  species,
  pokemon,
  typeResources,
}: {
  species: PokemonSpecies
  pokemon: Pokemon
  typeResources: Type[]
}) {
  const { language } = useLanguage()
  const name = species.names.filter(
    (nameResource) => nameResource.language.name === language
  )[0].name

  // const types = typeResources.map((resource) => {
  //   const typeName = resource.names.find((n) => n.language.name === language)!
  //   return {
  //     id: resource.id,
  //     key: resource.name,
  //     name: typeName.name,
  //   }
  // })

  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  const leadingZeros = imageId.match(/^0+/)?.[0] || ''
  const significantDigits = imageId.slice(leadingZeros.length)

  return (
    <section className="flex flex-col items-start p-4 lg:flex-row lg:items-end lg:gap-12">
      <div className="flex flex-col items-start gap-4">
        {/* <div className="flex flex-row items-center gap-4"> */}
        <h2 className="relative font-mono text-2xl sm:text-3xl">
          <span className="text-zinc-400 dark:text-zinc-600">
            {leadingZeros}
          </span>
          <span className="text-black dark:text-white">
            {significantDigits}
          </span>
        </h2>
        {/* </div> */}
        <div className="flex flex-col items-start gap-6">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl dark:text-white">
            {name}
          </h1>
          <ul className="flex flex-row gap-2">
            {typeResources.map((type) => (
              <li key={type.id}>
                <TypePill type={type} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-row gap-6">
        <Image
          src={pokemon.sprites.other.home.front_default!}
          alt={`${species.name} front default`}
          width={200}
          height={200}
          priority
          className="h-32 object-scale-down sm:h-40 md:h-52"
        />
        <Image
          src={pokemon.sprites.other.home.front_shiny!}
          alt={`${species.name} front shiny`}
          width={200}
          height={200}
          priority
          className="h-32 object-scale-down sm:h-40 md:h-52"
        />
      </div>
    </section>
  )
}
