import { NamedAPIResource } from 'pokedex-promise-v2'
import Navigation from '@/components/shared/Navigation'
import Search from '@/components/shared/Search'
import { SearchItem, SearchProvider } from '@/components/shared/SearchProvider'
import { getTestSpeciesList, pokeapi } from '@/lib/providers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export default async function Header() {
  const speciesList = await getTestSpeciesList()
  const species = await pokeapi.getPokemonSpeciesByName(
    speciesList.results.map((resource: NamedAPIResource) => resource.name)
  )

  const items: SearchItem[] = species.map((specie) => {
    const imageId = specie.id.toString().padStart(4, '0')
    return {
      id: specie.id,
      title: getTranslation(specie.names, 'name'),
      slug: specie.name,
      path: `${specie.name}`,
      keywords: [specie.name, getTranslation(specie.names, 'name')],
      imageUrl: `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`,
    } as SearchItem
  })

  return (
    <header className="w-full">
      <Navigation />
      <SearchProvider allItems={items}>
        <Search />
      </SearchProvider>
    </header>
  )
}
