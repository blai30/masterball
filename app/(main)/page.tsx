import { Metadata } from 'next'
import pMap from 'p-map'
import { Pokemon, PokemonSpecies } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import { getTestSpeciesList } from '@/lib/providers'
import { excludedVariants } from '@/lib/utils/excludedSlugs'
import { getTranslation, TypeKey } from '@/lib/utils/pokeapiHelpers'
import SpeciesCardGrid from '@/components/compounds/SpeciesCardGrid'

export const dynamic = 'force-static'
export const dynamicParams = false

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
  const speciesList =
    process?.env?.NODE_ENV && process?.env?.NODE_ENV === 'development'
      ? await getTestSpeciesList()
      : await pokeapi.getList('pokemon-species', 1025, 0)

  const species = await pMap(
    speciesList.results,
    async (result) => {
      const resource = await pokeapi.getResource<PokemonSpecies>(result.url)
      return resource
    },
    { concurrency: 4 }
  )

  const speciesPokemon: Record<string, Pokemon> = Object.fromEntries(
    await pMap(
      species,
      async (specie) => {
        const pokemon = await pokeapi.getResource<Pokemon>(
          specie.varieties
            .filter((variant) => !excludedVariants.includes(variant.name))
            .find((v) => v.is_default)!.pokemon.url
        )
        return [specie.name, pokemon] as const
      },
      { concurrency: 4 }
    )
  )

  const speciesData = species.map((specie) => {
    const pokemon = speciesPokemon[specie.name]
    return {
      id: specie.id,
      slug: specie.name,
      name: getTranslation(specie.names, 'name')!,
      types: pokemon.types.map((type) => type.type.name as TypeKey),
    }
  })

  return (
    <div className="mx-auto w-full max-w-[96rem] px-4">
      <SpeciesCardGrid data={speciesData} />
    </div>
  )
}
