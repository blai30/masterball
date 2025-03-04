import {
  Ability,
  EggGroup,
  Item,
  Move,
  MoveDamageClass,
  NamedAPIResource,
  Type,
} from 'pokedex-promise-v2'
import Header from '@/components/shared/Header'
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
  DamageClassLabels,
  DamageClassKey,
  getMonstersBySpecies,
  getTranslation,
  TypeLabels,
  TypeKey,
} from '@/lib/utils/pokeapiHelpers'

// Process data in smaller chunks to avoid memory issues
async function fetchInChunks(
  items: NamedAPIResource[],
  fetchFn: Function,
  chunkSize: number = 50
) {
  const results = []
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize)
    const chunkResults = await fetchFn(chunk.map((item) => item.name))
    results.push(...chunkResults)
  }
  return results
}

export default async function Shell() {
  const speciesList = await getTestSpeciesList()
  const movesList = await getTestMovesList()
  const abilitiesList = await getTestAbilitiesList()
  const itemsList = await getTestItemsList()
  const eggGroupsList = await pokeapi.getEggGroupsList()

  // Process data in chunks to prevent memory issues
  const species = await fetchInChunks(
    speciesList.results,
    pokeapi.getPokemonSpeciesByName,
    20
  )

  // Limit number of monsters for development if needed
  // const limitedSpecies = species.slice(0, 50); // Uncomment to limit species
  // const monsters = (await Promise.all(limitedSpecies.map(getMonstersBySpecies))).flat();
  const monsters = (await Promise.all(species.map(getMonstersBySpecies))).flat()

  const moves: Move[] = await fetchInChunks(
    movesList.results,
    pokeapi.getMoveByName
  )
  const abilities: Ability[] = await fetchInChunks(
    abilitiesList.results,
    pokeapi.getAbilityByName
  )
  const items: Item[] = await fetchInChunks(
    itemsList.results,
    pokeapi.getItemByName
  )

  const types: Type[] = await pokeapi.getTypeByName(Object.values(TypeKey))
  const damageClass: MoveDamageClass[] = await pokeapi.getMoveDamageClassByName(
    Object.values(DamageClassKey)
  )
  const eggGroups: EggGroup[] = await fetchInChunks(
    eggGroupsList.results,
    pokeapi.getEggGroupByName
  )

  const monsterItems: IndexItem[] = await Promise.all(
    monsters.map(async (monster) => {
      const { id, key, name, species, pokemon, form } = monster
      const imageId = id.toString().padStart(4, '0')
      const imageUrl =
        pokemon.sprites.other?.home?.front_default ??
        pokemon.sprites.other?.['official-artwork'].front_default ??
        `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`
      const title = `${name} #${imageId}`
      const path = form ? `/${species.name}/${form.name}` : `/${species.name}`

      return {
        id,
        title,
        slug: key,
        path,
        // imageUrl,
      } as IndexItem
    })
  )

  const moveItems: IndexItem[] = moves.map((move) => ({
    id: move.id,
    title: getTranslation(move.names, 'name')!,
    slug: move.name,
    path: `/move/${move.name}`,
  }))

  const abilityItems: IndexItem[] = abilities.map((ability) => ({
    id: ability.id,
    title: getTranslation(ability.names, 'name')!,
    slug: ability.name,
    path: `/ability/${ability.name}`,
  }))

  const itemItems: IndexItem[] = items.map((item) => ({
    id: item.id,
    title: getTranslation(item.names, 'name')!,
    slug: item.name,
    path: `/item/${item.name}`,
  }))

  const typeItems: IndexItem[] = types.map((type) => ({
    id: type.id,
    title: TypeLabels[type.name as TypeKey],
    slug: type.name,
    path: `/type/${type.name}`,
  }))

  const damageClassItems: IndexItem[] = damageClass.map((damageClass) => {
    return {
      id: damageClass.id,
      title: DamageClassLabels[damageClass.name as DamageClassKey],
      slug: damageClass.name,
      path: `/damage-class/${damageClass.name}`,
    } as IndexItem
  })

  const eggGroupItems: IndexItem[] = eggGroups.map((eggGroup) => {
    const title = getTranslation(eggGroup.names, 'name')!
    const imageUrl =
      'https://resource.pokemon-home.com/battledata/img/pokei128/icon0000_f00_s0.png'
    return {
      id: eggGroup.id,
      title,
      slug: eggGroup.name,
      path: `/egg-group/${eggGroup.name}`,
      // imageUrl,
    } as IndexItem
  })

  const allItems = [
    ...monsterItems,
    ...moveItems,
    ...abilityItems,
    ...itemItems,
    ...typeItems,
    ...damageClassItems,
    ...eggGroupItems,
  ]

  return (
    <GlobalIndexProvider indexItems={allItems}>
      <Header />
    </GlobalIndexProvider>
  )
}
