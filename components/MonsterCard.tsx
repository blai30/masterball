import Image from 'next/image'
import Link from 'next/link'
import { NamedAPIResource } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import TranslatedText from './TranslatedText'

const typeClasses: Record<string, string> = {
  ['normal']: 'bg-normal',
  ['fighting']: 'bg-fighting',
  ['flying']: 'bg-flying',
  ['poison']: 'bg-poison',
  ['ground']: 'bg-ground',
  ['rock']: 'bg-rock',
  ['bug']: 'bg-bug',
  ['ghost']: 'bg-ghost',
  ['steel']: 'bg-steel',
  ['fire']: 'bg-fire',
  ['water']: 'bg-water',
  ['grass']: 'bg-grass',
  ['electric']: 'bg-electric',
  ['psychic']: 'bg-psychic',
  ['ice']: 'bg-ice',
  ['dragon']: 'bg-dragon',
  ['dark']: 'bg-dark',
  ['fairy']: 'bg-fairy',
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

  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  return (
    <Link href={`/monster/${species.name}`}>
      <div className="flex flex-col items-center justify-between overflow-hidden rounded-xl bg-white p-2 group-hover:bg-zinc-300 dark:bg-black dark:group-hover:bg-zinc-700">
        <div className="relative flex w-full flex-col items-center rounded-md bg-zinc-100 p-4 dark:bg-zinc-900">
          <Image
            src={imageUrl}
            alt={species.name}
            width={128}
            height={128}
            priority
            className="h-full object-scale-down"
          />
          <div className="absolute inset-x-0 top-0 flex h-full flex-col items-start justify-between rounded-lg p-2">
            <p
              aria-hidden="true"
              className="font-mono text-sm text-zinc-400 dark:text-zinc-500"
            >
              {species.id}
            </p>
            <div className="flex flex-row gap-2">
              {types.map((typeResource) => (
                <Image
                  key={typeResource.id}
                  src={`${process.env.NEXT_PUBLIC_BASEPATH}/${typeResource.name}.png`}
                  alt={typeResource.name}
                  width={20}
                  height={20}
                  className={[
                    'rounded-xs object-contain',
                    typeClasses[typeResource.name],
                  ].join(' ')}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-row justify-between px-2 pt-2">
          <h3 className="rounded-xs font-normal text-black dark:text-white">
            <TranslatedText resources={species.names} field="name" />
          </h3>
        </div>
      </div>
    </Link>
  )
}
