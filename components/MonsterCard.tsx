import Image from 'next/image'
import Link from 'next/link'
import { NamedAPIResource } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'

const typeIconUrl = (type: string) => `/${type}.png`

const typeClasses: { [key: string]: string } = {
  ['normal']: 'bg-[#999999]',
  ['fighting']: 'bg-[#ffa202]',
  ['flying']: 'bg-[#95c9ff]',
  ['poison']: 'bg-[#994dcf]',
  ['ground']: 'bg-[#ab7939]',
  ['rock']: 'bg-[#bcb889]',
  ['bug']: 'bg-[#9fa424]',
  ['ghost']: 'bg-[#6e4570]',
  ['steel']: 'bg-[#6aaed3]',
  ['fire']: 'bg-[#ff612c]',
  ['water']: 'bg-[#2992ff]',
  ['grass']: 'bg-[#42bf24]',
  ['electric']: 'bg-[#ffdb00]',
  ['psychic']: 'bg-[#ff637f]',
  ['ice']: 'bg-[#42d8ff]',
  ['dragon']: 'bg-[#5462d6]',
  ['dark']: 'bg-[#4f4747]',
  ['fairy']: 'bg-[#ffb1ff]',
}

export default async function MonsterCard({
  speciesResource,
  language,
}: {
  speciesResource: NamedAPIResource
  language: string
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
    <Link href={`monster/${species.name}`}>
      <div className="flex flex-col items-center justify-between overflow-hidden rounded-lg p-2 group-hover:bg-zinc-300 group-hover:dark:bg-zinc-700">
        <div className="relative flex w-full flex-col items-center rounded-md bg-zinc-100 p-4 dark:bg-zinc-900">
          <Image
            src={imageUrl}
            alt={species.name}
            width={96}
            height={96}
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
                  src={typeIconUrl(typeResource.name)}
                  alt={typeResource.name}
                  width={20}
                  height={20}
                  className={[
                    'rounded-sm object-contain',
                    typeClasses[typeResource.name],
                  ].join(' ')}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-row justify-between px-2 pt-2">
          <h3 className="font-light text-black dark:text-white">
            {
              species.names.filter(
                (nameResource) => nameResource.language.name === language
              )[0].name
            }
          </h3>
        </div>
      </div>
    </Link>
  )
}
