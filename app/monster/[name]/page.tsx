import Image from 'next/image'
import { PokeAPI } from 'pokeapi-types'

async function getSpecies(name: string) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${name}`
  )
  const data: PokeAPI.PokemonSpecies = await response.json()
  return data
}

async function getPokemon(name: string) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  const data: PokeAPI.Pokemon = await response.json()
  return data
}

export async function generateStaticParams() {
  const response = await fetch(
    'https://pokeapi.co/api/v2/pokemon-species?limit=2000'
  )
  const data: PokeAPI.NamedAPIResourceList = await response.json()

  return data.results.map((result) => ({
    name: result.name,
  }))
}

export default async function Page({ params }: { params: { name: string } }) {
  const { name } = params
  const species = await getSpecies(name)
  const pokemon = await getPokemon(species.varieties[0].pokemon.name)

  return (
    <main className="flex min-h-screen flex-col items-start justify-between gap-4 p-24">
      <h1 className="text-4xl font-bold">{pokemon.name}</h1>

      <Image
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        width={128}
        height={128}
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
