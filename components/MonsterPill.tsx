import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx/lite'
import { Pokemon, PokemonSpecies } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import { getTranslation, TypeName } from '@/lib/utils/pokeapiHelpers'
import GlassCard from '@/components/GlassCard'

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

export default async function MonsterPill({
  species,
}: {
  species: PokemonSpecies
}) {
  const pokemon: Pokemon = await pokeapi.getPokemonByName(
    species.varieties.find((variety) => variety.is_default)!.pokemon.name
  )
  const types = await pokeapi.getTypeByName(
    pokemon.types.map((type) => type.type.name)
  )

  const name = getTranslation(species.names, 'name')
  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  return (
    <GlassCard variant="link">
      <Link
        href={`/${species.name}`}
        className="group flex w-56 items-center gap-3 px-3 py-1"
      >
        <Image
          src={imageUrl}
          alt={species.name}
          width={64}
          height={64}
          priority
          className="w-16 object-contain py-1"
        />
        <div className="flex flex-col w-full h-full gap-2 justify-between">
          <h3 className="rounded-xs text-base font-medium text-zinc-700 dark:text-zinc-300">
            {name}
          </h3>
          <div className="flex flex-row gap-2">
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
      </Link>
    </GlassCard>
  )
}
