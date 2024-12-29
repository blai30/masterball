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
    species.varieties[0].pokemon.name,
  )
  const types = await pokeapi.getTypeByName(
    pokemon.types.map((type) => type.type.name),
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
            className="size-full object-scale-down p-2"
          />
        </div>
        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50" /> */}
      </div>
      <div className="absolute inset-0 flex flex-col items-start justify-between rounded-lg p-4 overflow-hidden">
        <p
          aria-hidden="true"
          className="text-sm text-zinc-600 dark:text-zinc-400 font-mono"
        >
          {species.id}
        </p>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-1">
            {types.map((typeResource) => (
              <Image
                key={typeResource.id}
                src={typeIconUrl(typeResource.name)}
                alt={typeResource.name}
                width={20}
                height={20}
                className={[
                  'object-contain rounded-sm',
                  typeClasses[typeResource.name],
                ].join(' ')}
              />
            ))}
          </div>
          <h3 className="font-medium text-white">
            <Link href={`monster/${species.name}`}>
              <span className="absolute inset-0" />
              {
                species.names.filter(
                  (nameResource) => nameResource.language.name === language,
                )[0].name
              }
            </Link>
          </h3>
        </div>
      </div>
    </>
  )
}
