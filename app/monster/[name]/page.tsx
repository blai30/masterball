import { Metadata } from 'next'
import Image from 'next/image'
import { pokeapi } from '@/lib/providers'

export async function generateStaticParams() {
  const speciesList = await pokeapi.getPokemonSpeciesList({
    limit: 50,
    offset: 251,
  })

  return speciesList.results.map((result) => ({
    name: result.name,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>
}): Promise<Metadata> {
  const language = 'en'
  const { name } = await params
  const species = await pokeapi.getPokemonSpeciesByName(name)
  const pokemon = await pokeapi.getPokemonByName(
    species.varieties[0].pokemon.name
  )
  const types = await pokeapi.getTypeByName(
    pokemon.types.map((type) => type.type.name)
  )
  const typeNames = types.map((t) => {
    const filtered = t.names.filter((n) => n.language.name === language)
    return filtered.map((v) => v.name)
  })

  const imageId = pokemon.id.toString().padStart(4, '0')

  return {
    title: species.names.filter(
      (nameResource) => nameResource.language.name === language
    )[0].name,
    description: `${typeNames.join(' ')}`,
    openGraph: {
      images: [
        {
          url: `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`,
          width: 128,
          height: 128,
          alt: species.name,
        },
      ],
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const language = 'en'
  const { name } = await params
  const species = await pokeapi.getPokemonSpeciesByName(name)
  const pokemon = await pokeapi.getPokemonByName(
    species.varieties[0].pokemon.name
  )
  const types = await pokeapi.getTypeByName(
    pokemon.types.map((type) => type.type.name)
  )

  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  return (
    <div className="container mx-auto flex flex-col gap-8">
      <div className="flex flex-row items-end justify-between">
        <div className="flex flex-col gap-4 items-start">
          <h2 className="text-base/7 font-semibold text-indigo-400">
            {species.id}
          </h2>
          <h1 className="text-4xl font-semibold tracking-tight dark:text-white sm:text-5xl">
            {
              species.names.filter(
                (nameResource) => nameResource.language.name === language
              )[0].name
            }
          </h1>
        </div>
        <Image
          src={imageUrl}
          alt={species.name}
          width={128}
          height={128}
          priority
          className="h-full object-scale-down"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-2">
        <div className="flex lg:col-span-4">
          <div className="overflow-hidden rounded-lg bg-zinc-900 max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]">
            <div className="p-10 gap-2 flex flex-col">
              <h3 className="text-sm/4 font-semibold text-gray-400">
                Releases
              </h3>
              <p className="text-lg font-medium tracking-tight text-white">
                Push to deploy
              </p>
              <p className="text-sm/6 text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                gravida justo et nulla efficitur, maximus egestas sem
                pellentesque.
              </p>
            </div>
          </div>
        </div>
        <div className="flex lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-zinc-900 lg:rounded-tr-[2rem]">
            <div className="p-10 gap-2 flex flex-col">
              <h3 className="text-sm/4 font-semibold text-gray-400">
                Integrations
              </h3>
              <p className="text-lg font-medium tracking-tight text-white">
                Connect your favorite tools
              </p>
              <p className="text-sm/6 text-gray-400">
                Curabitur auctor, ex quis auctor venenatis, eros arcu rhoncus
                massa.
              </p>
            </div>
          </div>
        </div>
        <div className="flex lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-zinc-900 lg:rounded-bl-[2rem]">
            <div className="p-10 gap-2 flex flex-col">
              <h3 className="text-sm/4 font-semibold text-gray-400">
                Security
              </h3>
              <p className="text-lg font-medium tracking-tight text-white">
                Advanced access control
              </p>
              <p className="text-sm/6 text-gray-400">
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
                posuere cubilia.
              </p>
            </div>
          </div>
        </div>
        <div className="flex lg:col-span-4">
          <div className="overflow-hidden rounded-lg bg-zinc-900 max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]">
            <div className="p-10 gap-2 flex flex-col">
              <h3 className="text-sm/4 font-semibold text-gray-400">
                Performance
              </h3>
              <p className="text-lg font-medium tracking-tight text-white">
                Lightning-fast builds
              </p>
              <p className="text-sm/6 text-gray-400">
                Sed congue eros non finibus molestie. Vestibulum euismod augue
                vel commodo vulputate. Maecenas at augue sed elit dictum
                vulputate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
