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
      className="group flex flex-col items-center justify-between overflow-visible"
    >
      <div className="flex flex-col items-center justify-between overflow-hidden rounded-xl bg-white p-2 group-hover:bg-zinc-300 dark:bg-black dark:group-hover:bg-zinc-700">
        <div className="relative flex w-full flex-col items-center rounded-md bg-zinc-100 p-4 dark:bg-zinc-900">
          <Image
            src={imageUrl}
            alt={species.name}
            width={128}
            height={128}
            priority
            className="w-full object-scale-down"
          />
          <div className="absolute inset-x-0 top-0 flex h-full flex-col items-start justify-between rounded-lg p-2">
            <p
              aria-hidden="true"
              className="font-num text-sm text-zinc-400 dark:text-zinc-500"
            >
              {species.id}
            </p>
            <div className="flex flex-row gap-2 opacity-0 group-hover:opacity-100">
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
            </div>
          </div>
        </div>
        <div className="flex w-full flex-row justify-between px-2 pt-2">
          <h3 className="rounded-xs text-base font-light text-black dark:text-white">
            {name}
          </h3>
        </div>
      </div>
    </Link>
  )
}
