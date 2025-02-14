import { NamedAPIResource, type Pokemon } from 'pokedex-promise-v2'
import Navigation from '@/components/shared/Navigation'
import {
  IndexItem,
  GlobalIndexProvider,
} from '@/components/shared/GlobalIndexProvider'
import {
  getTestAbilitiesList,
  getTestItemsList,
  getTestMovesList,
  getTestSpeciesList,
  pokeapi,
} from '@/lib/providers'
import {
  DamageClassName,
  getTranslation,
  TypeName,
} from '@/lib/utils/pokeapiHelpers'

export default async function Header() {
  const speciesList = await getTestSpeciesList()
  const movesList = await getTestMovesList()
  const abilitiesList = await getTestAbilitiesList()
  const itemsList = await getTestItemsList()
  const eggGroupsList = await pokeapi.getEggGroupsList()

  const species = await pokeapi.getPokemonSpeciesByName(
    speciesList.results.map((resource: NamedAPIResource) => resource.name)
  )
  const moves = await pokeapi.getMoveByName(
    movesList.results.map((resource: NamedAPIResource) => resource.name)
  )
  const abilities = await pokeapi.getAbilityByName(
    abilitiesList.results.map((resource: NamedAPIResource) => resource.name)
  )
  const items = await pokeapi.getItemByName(
    itemsList.results.map((resource: NamedAPIResource) => resource.name)
  )
  const types = await pokeapi.getTypeByName(Object.values(TypeName))
  const damageClass = await pokeapi.getMoveDamageClassByName(
    Object.values(DamageClassName)
  )
  const eggGroups = await pokeapi.getEggGroupByName(
    eggGroupsList.results.map((resource: NamedAPIResource) => resource.name)
  )

  const speciesItems: IndexItem[] = species.map((specie) => {
    const imageId = specie.id.toString().padStart(4, '0')
    return {
      id: specie.id,
      title: getTranslation(specie.names, 'name'),
      slug: specie.name,
      path: `${specie.name}`,
      imageUrl: `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`,
    } as IndexItem
  })

  const movesItems: IndexItem[] = moves.map((move) => {
    return {
      id: move.id,
      title: getTranslation(move.names, 'name'),
      slug: move.name,
      path: `move/${move.name}`,
    } as IndexItem
  })

  const abilitiesItems: IndexItem[] = abilities.map((ability) => {
    return {
      id: ability.id,
      title: getTranslation(ability.names, 'name'),
      slug: ability.name,
      path: `ability/${ability.name}`,
    } as IndexItem
  })

  const itemsItems: IndexItem[] = items.map((item) => {
    return {
      id: item.id,
      title: getTranslation(item.names, 'name'),
      slug: item.name,
      path: `item/${item.name}`,
    } as IndexItem
  })

  const typeItems: IndexItem[] = types.map((type) => {
    return {
      id: type.id,
      title: getTranslation(type.names, 'name'),
      slug: type.name,
      path: `type/${type.name}`,
    } as IndexItem
  })

  const damageClassItems: IndexItem[] = damageClass.map((type) => {
    return {
      id: type.id,
      title: getTranslation(type.names, 'name'),
      slug: type.name,
      path: `damage-class/${type.name}`,
    } as IndexItem
  })

  const eggGroupsItems: IndexItem[] = eggGroups.map((eggGroup) => {
    return {
      id: eggGroup.id,
      title: getTranslation(eggGroup.names, 'name'),
      slug: eggGroup.name,
      path: `egg-group/${eggGroup.name}`,
    } as IndexItem
  })

  const allItems = [
    ...speciesItems,
    ...movesItems,
    ...abilitiesItems,
    ...itemsItems,
    ...typeItems,
    ...damageClassItems,
    ...eggGroupsItems,
  ]

  return (
    <header className="w-full">
      <GlobalIndexProvider indexItems={allItems}>
        <Navigation />
      </GlobalIndexProvider>
    </header>
  )
}
