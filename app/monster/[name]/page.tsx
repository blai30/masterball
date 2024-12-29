import { Metadata } from 'next'
import Image from 'next/image'
import { pokeapi } from '@/lib/providers'
import { StatsRadarChart } from '@/components/StatsRadarChart'

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
    <div className="container mx-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-light">
          {
            species.names.filter(
              (nameResource) => nameResource.language.name === language
            )[0].name
          }
        </h1>

        <div className="grid grid-cols-6 grid-rows-4 gap-4">
          <section className="col-span-1 row-span-1 rounded-lg p-2 bg-zinc-100 dark:bg-zinc-900">
            <Image
              src={imageUrl}
              alt={pokemon.name}
              width={128}
              height={128}
              priority
              className="border"
            />
          </section>

          <section className="col-span-2 row-span-1 rounded-lg p-2 bg-zinc-100 dark:bg-zinc-900">
            <h2 className="text-2xl font-extralight">Types</h2>
            <ul className="list-disc pl-5">
              {pokemon.types.map((type) => (
                <li key={type.type.name}>{type.type.name}</li>
              ))}
            </ul>
          </section>

          <section className="col-span-2 row-span-1 rounded-lg p-2 bg-zinc-100 dark:bg-zinc-900">
            <h2 className="text-2xl font-extralight">Gender ratio</h2>
            <ul className="list-disc pl-5">
              <li className="text-blue-800 dark:text-blue-200">87.5% male</li>
              <li className="text-pink-800 dark:text-pink-200">12.5% female</li>
            </ul>
          </section>

          <section className="col-span-2 row-span-2 rounded-lg p-2 bg-zinc-100 dark:bg-zinc-900">
            <h2 className="text-2xl font-extralight">Abilities</h2>
            <ul className="list-disc pl-5">
              {pokemon.abilities.map((ability) => (
                <li key={ability.ability.name}>
                  {ability.ability.name +
                    (ability.is_hidden ? ' (hidden)' : '')}
                </li>
              ))}
            </ul>
          </section>

          <section className="col-span-2 row-span-2 rounded-lg p-2 bg-zinc-100 dark:bg-zinc-900">
            <h2 className="text-2xl font-extralight">Stats</h2>
            <ul className="list-disc pl-5">
              {pokemon.stats.map((stat) => (
                <li key={stat.stat.name}>
                  <p>
                    {stat.stat.name}: {stat.base_stat}
                  </p>
                  <meter value={stat.base_stat} min={0} max={255} />
                </li>
              ))}
            </ul>
          </section>

          <section className="col-span-2 row-span-2 rounded-lg p-2 bg-zinc-100 dark:bg-zinc-900">
            <h2 className="text-2xl font-extralight">Stats</h2>
            <StatsRadarChart />
          </section>

          {/* <section className="col-span-2 dark:bg-zinc-900 p-2 rounded-lg">
            <h2 className="text-2xl font-extralight">Moves</h2>
            <ul className="list-disc pl-5">
              {pokemon.moves.map((move) => (
                <li key={move.move.name}>
                  {move.move.name}
                </li>
              ))}
            </ul>
          </section> */}
        </div>
      </div>
    </div>
  )
}
