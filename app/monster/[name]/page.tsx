import { Metadata } from 'next'
import Image from 'next/image'
import Pokedex from 'pokedex-promise-v2'

export async function generateStaticParams() {
  const pokeapi = new Pokedex()
  const speciesList = await pokeapi.getPokemonSpeciesList({ limit: 20 })

  return speciesList.results.map((result) => ({
    name: result.name,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>
}): Promise<Metadata> {
  const { name } = await params
  const pokeapi = new Pokedex()
  const species = await pokeapi.getPokemonSpeciesByName(name)
  const pokemon = await pokeapi.getPokemonByName(species.varieties[0].pokemon.name)
  const imageId = pokemon.id.toString().padStart(4, '0')

  return {
    title: pokemon.name,
    openGraph: {
      images: [
        `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`,
      ],
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const pokeapi = new Pokedex()
  const species = await pokeapi.getPokemonSpeciesByName(name)
  const pokemon = await pokeapi.getPokemonByName(species.varieties[0].pokemon.name)
  const imageId = pokemon.id.toString().padStart(4, '0')

  return (
    <main className="flex min-h-screen flex-col items-start justify-between gap-4 p-24">
      <h1 className="text-4xl font-bold">{pokemon.name}</h1>

      <Image
        src={`https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`}
        alt={pokemon.name}
        width={128}
        height={128}
        priority
        className="border"
        style={{ imageRendering: 'pixelated' }}
      />

      <section>
        <h2 className="text-2xl font-semibold">Types</h2>
        <ul className="list-disc pl-5">
          {pokemon.types.map((type) => (
            <li key={type.type.name}>{type.type.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Abilities</h2>
        <ul className="list-disc pl-5">
          {pokemon.abilities.map((ability) => (
            <li key={ability.ability.name}>
              {ability.ability.name + (ability.is_hidden ? ' (hidden)' : '')}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Stats</h2>
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

      <section>
        <h2 className="text-2xl font-semibold">Moves</h2>
        <ul className="list-disc pl-5">
          {pokemon.moves.map((move) => (
            <li key={move.move.name}>
              {move.move.name} ({move.version_group_details.length} versions)
              <ul className="list-disc pl-5">
                {move.version_group_details.map((version) => (
                  <li
                    key={`${version.version_group.name}_${version.move_learn_method.name}_${version.level_learned_at ?? 0}`}
                  >
                    {version.version_group.name} (
                    {version.move_learn_method.name})
                    {version.move_learn_method.name === 'level-up' && (
                      <p>Learned at level {version.level_learned_at}</p>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
