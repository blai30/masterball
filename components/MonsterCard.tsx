'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PokemonSpecies } from 'pokedex-promise-v2'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import GlassCard from '@/components/GlassCard'

export default function MonsterCard({
  species,
}: {
  species: PokemonSpecies
}) {
  const name = getTranslation(species.names, 'name')
  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  return (
    <GlassCard variant="link" className="h-full rounded-xl">
      <Link
        href={`/${species.name}`}
        className="group flex flex-col items-center justify-between px-2 py-3"
      >
        <p
          aria-hidden="true"
          className="font-num text-sm text-zinc-400 dark:text-zinc-500"
        >
          {species.id}
        </p>
        <Image
          src={imageUrl}
          alt={species.name}
          width={128}
          height={128}
          loading="lazy"
          className="min-w-full object-scale-down py-1"
        />
        {/* <div className="flex flex-row gap-2 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
          {types.map((typeResource) => (
            <Image
              key={typeResource.id}
              src={`${process.env.NEXT_PUBLIC_BASEPATH}/${typeResource.name}.png`}
              alt={typeResource.name}
              width={20}
              height={20}
              className={clsx(
                'rounded-xs object-contain',
                typeClasses[typeResource.name]
              )}
            />
          ))}
        </div> */}
        <h3 className="rounded-xs text-base font-medium text-zinc-700 dark:text-zinc-300">
          {name}
        </h3>
      </Link>
    </GlassCard>
  )
}
