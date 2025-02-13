import { NamedAPIResource, type Pokemon } from 'pokedex-promise-v2'
import Navigation from '@/components/shared/Navigation'
import {
  IndexItem,
  GlobalIndexProvider,
} from '@/components/shared/GlobalIndexProvider'
import { getTestSpeciesList, pokeapi } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export default async function Header() {
  const speciesList = await getTestSpeciesList()
  const species = await pokeapi.getPokemonSpeciesByName(
    speciesList.results.map((resource: NamedAPIResource) => resource.name)
  )
  const defaultVarietyNames = species.map(
    (specie) =>
      specie.varieties.find((variety) => variety.is_default)!.pokemon.name
  )
  const defaultPokemon = await pokeapi.getPokemonByName(defaultVarietyNames)
  // Species to default variety map
  // TODO: Make this more generic for other pages and support all varieties
  const defaultVarieties: Record<string, Pokemon> = Object.fromEntries(
    defaultPokemon.map((pokemon) => [
      species.find(
        (specie) =>
          specie.varieties.find((v) => v.is_default)?.pokemon.name ===
          pokemon.name
      )?.name ?? '',
      pokemon,
    ])
  )

  const items: IndexItem[] = species.map((specie) => {
    const imageId = specie.id.toString().padStart(4, '0')
    return {
      id: specie.id,
      title: getTranslation(specie.names, 'name'),
      slug: specie.name,
      path: `${specie.name}`,
      keywords: [
        ...(defaultVarieties[specie.name].types.map(
          (type) => type.type.name
        ) as string[]),
      ],
      imageUrl: `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`,
    } as IndexItem
  })

  return (
    <header className="w-full">
      <GlobalIndexProvider indexItems={items}>
        <Navigation />
      </GlobalIndexProvider>
    </header>
  )
}
