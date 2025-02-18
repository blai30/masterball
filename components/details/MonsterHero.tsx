import Image from 'next/image'
import { Pokemon, PokemonSpecies } from 'pokedex-promise-v2'
import TypePill from '@/components/TypePill'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export default function MonsterHero({
  species,
  pokemon,
}: {
  species: PokemonSpecies
  pokemon: Pokemon
}) {
  const name = getTranslation(species.names, 'name')

  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  const leadingZeros = imageId.match(/^0+/)?.[0] || ''
  const significantDigits = imageId.slice(leadingZeros.length)

  return (
    <section className="flex flex-col items-start gap-4 lg:flex-row lg:items-end lg:gap-12">
      <div className="flex flex-col items-start gap-4">
        {/* <div className="flex flex-row items-center gap-4"> */}
        <p className="font-num relative text-2xl sm:text-3xl">
          <span className="text-zinc-400 dark:text-zinc-600">
            {leadingZeros}
          </span>
          <span className="text-black dark:text-white">
            {significantDigits}
          </span>
        </p>
        {/* </div> */}
        <div className="flex flex-col items-start gap-6">
          <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl md:text-6xl dark:text-white">
            {name}
          </h1>
          <ul className="flex flex-row gap-2">
            {pokemon.types.map((type) => (
              <li key={type.type.name}>
                <TypePill variant={type.type.name} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex">
        <div className="grid w-full grid-cols-2 gap-8">
          <Image
            src={pokemon.sprites.other.home.front_default!}
            // src={pokemon.sprites.front_default!}
            alt={`${species.name} front default`}
            width={200}
            height={200}
            priority
            loading="eager"
            className="object-scale-down"
          />
          <Image
            src={pokemon.sprites.other.home.front_shiny!}
            // src={pokemon.sprites.front_shiny!}
            alt={`${species.name} front shiny`}
            width={200}
            height={200}
            priority
            loading="eager"
            className="object-scale-down"
          />
        </div>
      </div>
    </section>
  )
}
