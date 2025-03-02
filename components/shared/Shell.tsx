import Image from 'next/image'
import { NamedAPIResource } from 'pokedex-promise-v2'
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
  DamageClassName,
  getMonstersBySpecies,
  getTranslation,
  TypeLabels,
  TypeName,
} from '@/lib/utils/pokeapiHelpers'
import { Accessibility, Backpack, Swords } from 'lucide-react'
import TypeIcon from '@/components/TypeIcon'
import DamageClassIcon from '@/components/DamageClassIcon'

export default async function Shell() {
  const speciesList = await getTestSpeciesList()
  const movesList = await getTestMovesList()
  const abilitiesList = await getTestAbilitiesList()
  const itemsList = await getTestItemsList()
  const eggGroupsList = await pokeapi.getEggGroupsList()

  const species = await pokeapi.getPokemonSpeciesByName(
    speciesList.results.map((resource: NamedAPIResource) => resource.name)
  )
  const monsters = (await Promise.all(species.map(getMonstersBySpecies))).flat()
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

  const monsterItems: IndexItem[] = await Promise.all(
    monsters.map(async (monster) => {
      const { id, key, name: monsterName, species, pokemon, form } = monster
      const name = getTranslation(species.names, 'name')!
      const formName =
        getTranslation(form?.form_names, 'name') ??
        getTranslation(form?.names, 'name') ??
        ''
      const imageId = id.toString().padStart(4, '0')
      const imageUrl =
        pokemon.sprites.other?.home?.front_default ??
        pokemon.sprites.other?.['official-artwork'].front_default ??
        `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`
      const title = form
        ? `${name} (${formName}) #${imageId}`
        : `${name} #${imageId}`
      const path = form ? `/${species.name}/${form.name}` : `/${species.name}`

      return {
        id,
        title,
        slug: key,
        path,
        icon: (
          <Image
            src={imageUrl}
            alt={monsterName}
            width={64}
            height={64}
            className="pointer-events-none size-12 object-contain"
          />
        ),
      } as IndexItem
    })
  )

  // Create all item arrays using a more consistent pattern
  const moveItems: IndexItem[] = moves.map((move) => ({
    id: move.id,
    title: getTranslation(move.names, 'name')!,
    slug: move.name,
    path: `/move/${move.name}`,
    icon: (
      <Swords
        size={20}
        className="size-12 p-2 text-zinc-700 dark:text-zinc-300"
      />
    ),
  }))

  const abilityItems: IndexItem[] = abilities.map((ability) => ({
    id: ability.id,
    title: getTranslation(ability.names, 'name')!,
    slug: ability.name,
    path: `/ability/${ability.name}`,
    icon: (
      <Accessibility
        size={20}
        className="size-12 p-2 text-zinc-700 dark:text-zinc-300"
      />
    ),
  }))

  const itemItems: IndexItem[] = items.map((item) => ({
    id: item.id,
    title: getTranslation(item.names, 'name')!,
    slug: item.name,
    path: `/item/${item.name}`,
    icon: (
      <Backpack
        size={20}
        className="size-12 p-2 text-zinc-700 dark:text-zinc-300"
      />
    ),
  }))

  const typeItems: IndexItem[] = types.map((type) => ({
    id: type.id,
    title: TypeLabels[type.name as TypeName],
    slug: type.name,
    path: `/type/${type.name}`,
    icon: (
      <div className="flex size-12 items-center justify-center">
        <TypeIcon variant={type.name as TypeName} size="large" link={false} />
      </div>
    ),
  }))

  const damageClassItems: IndexItem[] = damageClass.map((damageClass) => {
    return {
      id: damageClass.id,
      title: DamageClassLabels[damageClass.name as DamageClassName],
      slug: damageClass.name,
      path: `/damage-class/${damageClass.name}`,
      icon: (
        <div className="flex size-12 items-center justify-center">
          <DamageClassIcon
            variant={damageClass.name}
            size="large"
            link={false}
          />
        </div>
      ),
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
      icon: (
        <Image
          src={imageUrl}
          alt={title}
          width={64}
          height={64}
          className="pointer-events-none size-12 object-contain"
        />
      ),
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
