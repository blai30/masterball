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
      <div className="flex flex-col items-center rounded-2xl overflow-hidden bg-zinc-900">
        <div className="flex flex-col items-center w-full">
          <div className="bg-zinc-900 w-full">
            <p
              aria-hidden="true"
              className="text-sm text-zinc-600 dark:text-zinc-400 font-mono text-center"
            >
              {species.id}
            </p>
          </div>
          <div className="bg-zinc-800 w-full">
            <Image
              src={imageUrl}
              alt={species.name}
              width={128}
              height={128}
              priority
              className="w-full object-scale-down"
            />
          </div>
          <div className="bg-zinc-900 w-full">
            <div className="flex flex-col gap-2 items-center p-2">
              <div className="flex flex-row gap-2">
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
        </div>
      </div>
    </>
  )
}
