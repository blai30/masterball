'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Pokemon, PokemonSpecies, Type } from 'pokedex-promise-v2'

export default function MonsterCard({
  id,
  species,
  pokemon,
  types,
  language,
}: {
  id: number
  species: PokemonSpecies
  pokemon: Pokemon
  types: Type[]
  language: string
}) {
  if (!pokemon) {
    return <div className="">n/a</div>
  }

  const typeNames = types.map(
    (type) =>
      type.names.find((value) => value.language.name === 'en')?.name ?? '',
  )
  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900"
      >
        <div className="absolute inset-0 overflow-hidden group-hover:opacity-75">
          <Image
            src={imageUrl}
            alt={species.name}
            width={128}
            height={128}
            priority
            className="size-full object-contain p-6"
          />
        </div>
        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50" /> */}
      </div>
      <div className="absolute inset-0 flex flex-col items-start justify-between rounded-lg p-4 overflow-hidden">
        <p aria-hidden="true" className="text-sm text-zinc-300 font-mono">
          {id}
        </p>
        <div className="flex flex-col gap-1">
          <p aria-hidden="true" className="text-sm text-white">
            {typeNames.join(' ')}
          </p>
          <h3 className="font-medium text-white">
            <Link href={`monster/${species.name}`}>
              <span className="absolute inset-0" />
              {species.names.find((name) => name.language.name === language)
                ?.name ?? 'Unknown'}
            </Link>
          </h3>
        </div>
      </div>
    </>
  )
}
