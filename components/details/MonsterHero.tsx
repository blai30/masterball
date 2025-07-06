import Image from 'next/image'
import clsx from 'clsx/lite'
import type { Pokemon, PokemonForm, PokemonSpecies } from 'pokedex-promise-v2'
import TypePill from '@/components/TypePill'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export default function MonsterHero({
  species,
  pokemon,
  form,
  className,
}: {
  species: PokemonSpecies
  pokemon: Pokemon
  form?: PokemonForm | undefined
  className?: string
}) {
  const name =
    getTranslation(form?.form_names, 'name') ??
    getTranslation(form?.names, 'name') ??
    getTranslation(species.names, 'name')!

  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = pokemon.is_default
    ? `https://raw.githubusercontent.com/blai30/PokemonSpritesDump/refs/heads/main/sprites/sprite_${imageId}_s0.webp`
    : `https://raw.githubusercontent.com/blai30/PokemonSpritesDump/refs/heads/main/sprites/sprite_${imageId}_${pokemon.name}_s0.webp`

  const leadingZeros = imageId.match(/^0+/)?.[0] || ''
  const significantDigits = imageId.slice(leadingZeros.length)

  return (
    <div
      className={clsx(
        'relative h-42 w-full max-w-md flex-row items-end gap-12',
        className
      )}
    >
      <div className="flex flex-col items-start gap-4">
        <p className="font-num text-2xl">
          <span className="text-zinc-400 dark:text-zinc-600">
            {leadingZeros}
          </span>
          <span className="text-black dark:text-white">
            {significantDigits}
          </span>
        </p>
        <div className="flex flex-col">
          <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white">
            {name}
          </h1>
        </div>
        <ul className="flex flex-row gap-2">
          {pokemon.types.map((type) => (
            <li key={type.type.name}>
              <TypePill variant={type.type.name} size="medium" />
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute right-0 bottom-0 flex">
        <Image
          src={imageUrl}
          alt={`${species.name} front default`}
          width={128}
          height={128}
          className="object-scale-down"
        />
      </div>
    </div>
  )
}
