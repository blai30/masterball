import { Metadata } from 'next'
import Image from 'next/image'
import { pokeapi } from '@/lib/providers'

export async function generateStaticParams() {
  const speciesList = await pokeapi.getPokemonSpeciesList({ limit: 30 })

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
  const species = await pokeapi.getPokemonSpeciesByName(name)
  const pokemon = await pokeapi.getPokemonByName(
    species.varieties[0].pokemon.name,
  )
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
  const language = 'en'
  const { name } = await params
  const species = await pokeapi.getPokemonSpeciesByName(name)
  const pokemon = await pokeapi.getPokemonByName(
    species.varieties[0].pokemon.name,
  )
  const types = await pokeapi.getTypeByName(
    pokemon.types.map((type) => type.type.name),
  )

  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold">
        {
          species.names.filter(
            (nameResource) => nameResource.language.name === language,
          )[0].name
        }
      </h1>

      <Image
        src={imageUrl}
        alt={pokemon.name}
        width={128}
        height={128}
        priority
        className="border"
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
              {move.move.name}
              {/* <ul className="list-disc pl-5">
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
              </ul> */}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
