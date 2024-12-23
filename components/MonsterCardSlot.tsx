import MonsterCard from '@/components/MonsterCard'
import Pokedex, { NamedAPIResource } from 'pokedex-promise-v2'

export default async function MonsterCardSlot({
  speciesResource,
  language,
}: {
  speciesResource: NamedAPIResource
  language: string
}) {
  const pokeapi = new Pokedex()
  const species = await pokeapi.getPokemonSpeciesByName(speciesResource.name)
  const pokemon = await pokeapi.getPokemonByName(
    species.varieties[0].pokemon.name,
  )
  const types = await pokeapi.getTypeByName(
    pokemon.types.map((type) => type.type.name),
  )

  return (
    <MonsterCard
      id={species.id}
      species={species}
      pokemon={pokemon}
      types={types}
      language={language}
    />
  )
}
