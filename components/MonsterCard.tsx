import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx/lite'
import { NamedAPIResource } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import { getTranslation, TypeName } from '@/lib/utils/pokeapiHelpers'

const typeClasses: Record<string, string> = {
  [TypeName.Normal]: 'bg-normal',
  [TypeName.Fighting]: 'bg-fighting',
  [TypeName.Flying]: 'bg-flying',
  [TypeName.Poison]: 'bg-poison',
  [TypeName.Ground]: 'bg-ground',
  [TypeName.Rock]: 'bg-rock',
  [TypeName.Bug]: 'bg-bug',
  [TypeName.Ghost]: 'bg-ghost',
  [TypeName.Steel]: 'bg-steel',
  [TypeName.Fire]: 'bg-fire',
  [TypeName.Water]: 'bg-water',
  [TypeName.Grass]: 'bg-grass',
  [TypeName.Electric]: 'bg-electric',
  [TypeName.Psychic]: 'bg-psychic',
  [TypeName.Ice]: 'bg-ice',
  [TypeName.Dragon]: 'bg-dragon',
  [TypeName.Dark]: 'bg-dark',
  [TypeName.Fairy]: 'bg-fairy',
}

export default async function MonsterCard({
  speciesResource,
}: {
  speciesResource: NamedAPIResource
}) {
  const species = await pokeapi.getPokemonSpeciesByName(speciesResource.name)
  const pokemon = await pokeapi.getPokemonByName(
    species.varieties[0].pokemon.name
  )
  const types = await pokeapi.getTypeByName(
    pokemon.types.map((type) => type.type.name)
  )

  const name = getTranslation(species.names, 'name')
  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  return (
    <Link
      href={`/monster/${species.name}`}
      className={clsx(
        'group from-50 flex flex-col items-center justify-between overflow-hidden',
        'rounded-l-sm rounded-tr-sm rounded-br-xl',
        'bg-gradient-to-br to-zinc-100 to-75% ring-1 ring-zinc-200 transition-colors hover:from-zinc-200 hover:to-zinc-100 hover:ring-zinc-300 hover:duration-0 focus-visible:from-zinc-100 focus-visible:to-zinc-200 focus-visible:ring-zinc-300 dark:from-zinc-900 dark:to-zinc-950 dark:ring-zinc-800 dark:hover:from-zinc-900 dark:hover:to-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:from-zinc-900 dark:focus-visible:to-zinc-800 dark:focus-visible:ring-zinc-700'
      )}
    >
      <div className="flex flex-col items-center justify-between gap-2 p-2">
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
          priority
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
      </div>
    </Link>
  )
}
