'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PokeAPI } from 'pokeapi-types'

export default function MonsterCard({
  species,
  language,
}: {
  species: PokeAPI.PokemonSpecies
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
        className="absolute inset-0 overflow-hidden rounded-lg"
      >
        <div className="absolute inset-0 overflow-hidden group-hover:opacity-75">
          <Image
            src={imageUrl}
            alt={species.name}
            width={128}
            height={128}
            priority
            className="size-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50" />
      </div>
      <div className="absolute inset-0 flex items-end rounded-lg p-6">
        <div>
          <p aria-hidden="true" className="text-sm text-white">
            {species.id}
          </p>
          <h3 className="mt-1 font-semibold text-white">
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
