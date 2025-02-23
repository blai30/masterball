import { Metadata } from 'next'
import { NamedAPIResource, Pokemon, PokemonSpecies } from 'pokedex-promise-v2'
import { getTestSpeciesList, pokeapi } from '@/lib/providers'
import MonsterCardGrid from '@/components/MonsterCardGrid'
import { getTranslation, Monster } from '@/lib/utils/pokeapiHelpers'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: 'Pokemon List',
    twitter: {
      card: 'summary',
    },
  }

  return metadata
}

export default async function Home() {
  // const speciesList = await pokeapi.getPokemonSpeciesList({
  //   limit: 22,
  //   offset: 718,
  // })

  const speciesList = await getTestSpeciesList()
  const species = await pokeapi.getPokemonSpeciesByName(
    speciesList.results.map((resource: NamedAPIResource) => resource.name)
  )

  const monsters: Monster[] = await Promise.all(
    species.map(async (species) => {
      const name = getTranslation(species.names, 'name')
      const pokemon = await pokeapi.getPokemonByName(
        species.varieties.find((variety) => variety.is_default)!.pokemon.name
      )

      return {
        id: species.id,
        key: species.name,
        name,
        species,
        pokemon,
      } as Monster
    })
  )

  return (
    <div className="container mx-auto">
      <MonsterCardGrid monsters={monsters} />
    </div>
  )
}
