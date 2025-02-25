import Image from 'next/image'
import { Pokemon, PokemonForm, PokemonSpecies } from 'pokedex-promise-v2'
import TypePill from '@/components/TypePill'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export default function MonsterHero({
  species,
  pokemon,
  form,
}: {
  species: PokemonSpecies
  pokemon: Pokemon
  form: PokemonForm
}) {
  const name = getTranslation(species.names, 'name')
  const formName =
    getTranslation(form.form_names, 'name') ??
    getTranslation(form.names, 'name') ??
    'Base'

  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl =
    pokemon.sprites.other.home.front_default ??
    pokemon.sprites.front_default ??
    `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  const leadingZeros = imageId.match(/^0+/)?.[0] || ''
  const significantDigits = imageId.slice(leadingZeros.length)

  return (
    <section className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:gap-12">
      <div className="flex flex-col items-start gap-2">
        <p className="font-num text-xl sm:text-2xl">
          <span className="text-zinc-400 dark:text-zinc-600">
            {leadingZeros}
          </span>
          <span className="text-black dark:text-white">
            {significantDigits}
          </span>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl dark:text-white">
          {name}
        </h1>
        <p className="text-lg font-medium tracking-tight text-zinc-600 sm:text-xl dark:text-zinc-400">
          {formName}
        </p>
        <ul className="flex flex-row gap-2">
          {pokemon.types.map((type) => (
            <li key={type.type.name}>
              <TypePill variant={type.type.name} size="medium" />
            </li>
          ))}
        </ul>
      </div>
      <Image
        src={imageUrl}
        alt={`${species.name} sprite`}
        width={128}
        height={128}
        priority
        loading="eager"
        className="object-scale-down"
      />
      {/* <div className="flex">
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
      </div> */}
    </section>
  )
}
