'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PokemonSpecies } from 'pokedex-promise-v2'

export default function MonsterCard({
  species,
  language,
}: {
  // species: PokeAPI.PokemonSpecies
  species: PokemonSpecies
  language: string
}) {
  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  return (
    // <Link
    //   href={`monster/${species.name}`}
    //   className="flex flex-row gap-2 rounded-lg bg-zinc-900 px-4 py-2 hover:bg-zinc-800"
    // >
    //   <p className="w-12">{species.id}</p>
    //   <p>
    //     {species.names.find((name) => name.language.name === language)
    //       ?.name ?? 'Unknown'}
    //   </p>
    // </Link>
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
            className="size-full object-scale-down"
          />
        </div>
        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50" /> */}
      </div>
      <div className="absolute inset-0 flex flex-col items-start justify-between rounded-lg p-4">
        <p aria-hidden="true" className="text-sm text-white">
          {species.id}
        </p>
        <div className="flex flex-col gap-1">
          <p aria-hidden="true" className="text-sm text-white">
            {'🔥❄️'}
          </p>
          <h3 className="font-semibold text-white">
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
