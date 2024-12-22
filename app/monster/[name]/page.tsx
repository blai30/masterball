import Image from 'next/image'
import { PokeAPI } from 'pokeapi-types'

export async function generateStaticParams() {
  const response = await fetch(
    'https://pokeapi.co/api/v2/pokemon-species?limit=2000'
  )
  const data: PokeAPI.NamedAPIResourceList = await response.json()

  return data.results.map((result) => ({
    name: result.name,
  }))
}

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const species = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${name}`
  ).then((res) => res.json() as Promise<PokeAPI.PokemonSpecies>)
  const pokemon = await fetch(species.varieties[0].pokemon.url).then(
    (res) => res.json() as Promise<PokeAPI.Pokemon>
  )
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
