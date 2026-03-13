import pMap from 'p-map'
import type {
  Ability,
  EggGroup,
  EvolutionChain,
  GrowthRate,
  Machine,
  Move,
  MoveElement,
  Pokemon,
  PokemonForm,
  PokemonSpecies,
  Type,
} from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import {
  LearnMethodKey,
  TypeKey,
  getEffectiveness,
  getMonstersBySpecies,
  getTranslation,
  type MoveRow,
  type TypeRelation,
} from '@/lib/utils/pokeapi-helpers'
import { excludedForms, excludedVariants } from '@/lib/utils/excluded-slugs'
import type { EvolutionNodeData } from '@/components/details/evolution/EvolutionSection'
import type { AbilitySectionData } from '@/components/details/abilities/AbilitiesSection'
import type { PokemonDetailPageProps } from '@/components/pages/PokemonDetailPageContent'

export async function fetchDetailPageData(
  slug: string,
  variantKey?: string
): Promise<PokemonDetailPageProps> {
  const species = await pokeapi.getByName<PokemonSpecies>('pokemon-species', slug)
  const monsters = await getMonstersBySpecies(species)

  const pokemonUrl = species.varieties
    .filter((v) => !excludedVariants.includes(v.pokemon.name))
    .find((v) => (variantKey ? v.pokemon.name === variantKey : v.is_default))!.pokemon.url
  const pokemon = await pokeapi.getResource<Pokemon>(pokemonUrl)

  const forms = await pMap(
    pokemon.forms.filter((form) => !excludedForms.includes(form.name)),
    async (form) => pokeapi.getByName<PokemonForm>('pokemon-form', form.name),
    { concurrency: 20 }
  )

  const form =
    pokemon.is_default || species.name === pokemon.name
      ? undefined
      : forms.find((f) => f.name === variantKey || f.name === pokemon.name)

  const [eggGroups, growthRate] = await Promise.all([
    pMap(
      species.egg_groups,
      async (eggGroup) => pokeapi.getResource<EggGroup>(eggGroup.url),
      { concurrency: 20 }
    ),
    pokeapi.getResource<GrowthRate>(species.growth_rate.url),
  ])

  const abilitiesResources = await pMap(
    pokemon.abilities.map((a) => a.ability.url),
    async (url) => pokeapi.getResource<Ability>(url),
    { concurrency: 20 }
  )
  const abilities: AbilitySectionData[] = pokemon.abilities.map((ability) => {
    const resource = abilitiesResources.find((a) => a.name === ability.ability.name)!
    return {
      id: resource.id,
      name: ability.ability.name,
      slot: ability.slot,
      hidden: ability.is_hidden,
      resource,
    }
  })

  const [typeResources, allTypeResources] = await Promise.all([
    pMap(
      pokemon.types.map((t) => t.type.url),
      async (url) => pokeapi.getResource<Type>(url),
      { concurrency: 20 }
    ),
    pMap(
      Object.values(TypeKey).map((t) => `https://pokeapi.co/api/v2/type/${t}`),
      async (url) => pokeapi.getResource<Type>(url),
      { concurrency: 20 }
    ),
  ])
  const typeEffectiveness = getEffectiveness(...typeResources)
  const allTypeRelations: TypeRelation[] = allTypeResources.map((typeResource) => ({
    type: typeResource,
    effectiveness: typeEffectiveness[typeResource.name as TypeKey],
  }))

  const evolutionChain = await fetch(species.evolution_chain.url).then(
    (r) => r.json() as Promise<EvolutionChain>
  )

  async function buildEvolutionTree(
    chain: EvolutionChain['chain']
  ): Promise<EvolutionNodeData> {
    const nodeSpecies = await fetch(chain.species.url).then(
      (r) => r.json() as Promise<PokemonSpecies>
    )
    const defaultVariant = nodeSpecies.varieties
      .filter((v) => !excludedVariants.includes(v.pokemon.name))
      .find((v) => v.is_default)
    let types: TypeKey[] = []
    if (defaultVariant) {
      const nodePokemon = await pokeapi.getResource<Pokemon>(defaultVariant.pokemon.url)
      types = nodePokemon.types.map((t) => t.type.name as TypeKey)
    }
    const imageId = nodeSpecies.id.toString().padStart(4, '0')
    const evolvesTo = await pMap(
      chain.evolves_to,
      async (child) => buildEvolutionTree(child),
      { concurrency: 4 }
    )
    return {
      speciesSlug: nodeSpecies.name,
      name: getTranslation(nodeSpecies.names, 'name')!,
      types,
      imageUrl: `https://raw.githubusercontent.com/blai30/PokemonSpritesDump/refs/heads/main/sprites/sprite_${imageId}_s0.webp`,
      evolvesTo,
    }
  }

  const evolutionTree = await buildEvolutionTree(evolutionChain.chain)

  const moveRowsByMethod: Record<LearnMethodKey, MoveRow[]> = {
    [LearnMethodKey.FormChange]: [],
    [LearnMethodKey.LevelUp]: [],
    [LearnMethodKey.Machine]: [],
    [LearnMethodKey.Tutor]: [],
    [LearnMethodKey.Egg]: [],
  }

  if (pokemon.moves.length > 0) {
    const uniqueMoveNames = [...new Set(pokemon.moves.map((move) => move.move.name))]
    const movesData = await pMap(
      uniqueMoveNames,
      async (name) => pokeapi.getByName<Move>('move', name),
      { concurrency: 20 }
    )

    const movesWithMachines = movesData.filter((move) => move.machines?.length > 0)
    const uniqueMachineUrls = [
      ...new Set(
        movesWithMachines.flatMap((move) =>
          move.machines.map((machine) => machine.machine.url)
        )
      ),
    ]
    const machinesData = await pMap(
      uniqueMachineUrls,
      async (url) => pokeapi.getResource<Machine>(url),
      { concurrency: 20 }
    )

    const machinesMap = new Map<string, Machine[]>()
    for (const move of movesWithMachines) {
      machinesMap.set(
        move.name,
        machinesData.filter((m) => m.move.name === move.name)
      )
    }

    const movesMap = Object.fromEntries(
      movesData.map((move) => [
        move.name,
        { ...move, machineItems: machinesMap.get(move.name) ?? [] },
      ])
    )

    const createMoveRows = (moves: MoveElement[], variant: LearnMethodKey): MoveRow[] => {
      const rows: MoveRow[] = []
      for (const m of moves) {
        const move = movesMap[m.move.name]
        for (const resource of m.version_group_details) {
          if (resource.move_learn_method.name === variant) {
            let id = move.id.toString()
            if (variant === LearnMethodKey.LevelUp) {
              id =
                resource.level_learned_at === 0
                  ? 'Evolve'
                  : resource.level_learned_at.toString()
            } else if (variant === LearnMethodKey.Machine && move.machineItems.length > 0) {
              const machine = move.machineItems.find(
                (machine: Machine) =>
                  machine.version_group.name === resource.version_group.name
              )
              if (machine?.item) id = machine.item.name.toUpperCase()
            }
            rows.push({
              id,
              slug: m.move.name,
              versionGroup: resource.version_group.name,
              type: move.type.name,
              damageClass: move.damage_class.name,
              name: getTranslation(move.names, 'name')!,
              defaultDescription:
                getTranslation(move.effect_entries, 'short_effect') ?? '',
              flavorTextEntries: move.flavor_text_entries.filter(
                (entry) => entry.language.name === 'en'
              ),
              power: move.power ?? undefined,
              accuracy: move.accuracy ?? undefined,
              pp: move.pp!,
            })
          }
        }
      }
      return rows
    }

    for (const method of Object.keys(moveRowsByMethod) as LearnMethodKey[]) {
      const methodMoves = pokemon.moves.filter((move) =>
        move.version_group_details.some((vgd) => vgd.move_learn_method.name === method)
      )
      moveRowsByMethod[method] = createMoveRows(methodMoves, method)
    }
  }

  return {
    species,
    pokemon,
    forms,
    form,
    monsters,
    eggGroups,
    growthRate,
    abilities,
    allTypeRelations,
    evolutionTree,
    moveRowsByMethod,
  }
}
