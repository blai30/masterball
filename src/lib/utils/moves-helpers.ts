import pMap from 'p-map'
import type { Machine, Move, MoveElement, Pokemon } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import {
  LearnMethodKey,
  getTranslation,
  type MoveRow,
  type DamageClassKey,
  type TypeKey,
} from '@/lib/utils/pokeapi-helpers'

function createMoveRows(
  moves: MoveElement[],
  movesMap: Record<string, Move & { machineItems: Machine[] }>,
  variant: LearnMethodKey
): MoveRow[] {
  const moveRows: MoveRow[] = []

  moves.forEach((m) => {
    const move = movesMap[m.move.name]
    if (!move) return

    m.version_group_details.forEach((resource) => {
      if (resource.move_learn_method.name === variant) {
        let id = move.id.toString()

        if (variant === LearnMethodKey.LevelUp) {
          id = resource.level_learned_at === 0 ? 'Evolve' : resource.level_learned_at.toString()
        } else if (variant === LearnMethodKey.Machine && move.machineItems) {
          const machine = move.machineItems.find(
            (mac: Machine) => mac.version_group.name === resource.version_group.name
          )
          if (machine?.item) {
            id = machine.item.name.toUpperCase()
          }
        }

        moveRows.push({
          id,
          slug: m.move.name,
          versionGroup: resource.version_group.name,
          type: move.type.name as TypeKey,
          damageClass: move.damage_class.name as DamageClassKey,
          name: getTranslation(move.names, 'name')!,
          defaultDescription: getTranslation(move.effect_entries, 'short_effect') ?? '',
          flavorTextEntries: move.flavor_text_entries.filter(
            (entry) => entry.language.name === 'en'
          ),
          power: move.power || undefined,
          accuracy: move.accuracy || undefined,
          pp: move.pp!,
        })
      }
    })
  })

  return moveRows
}

export async function buildMoveRowsByMethod(
  pokemon: Pokemon
): Promise<Record<LearnMethodKey, MoveRow[]>> {
  const moveRowsByMethod: Record<LearnMethodKey, MoveRow[]> = {
    [LearnMethodKey.FormChange]: [],
    [LearnMethodKey.LevelUp]: [],
    [LearnMethodKey.Machine]: [],
    [LearnMethodKey.Tutor]: [],
    [LearnMethodKey.Egg]: [],
  }

  if (pokemon.moves.length === 0) return moveRowsByMethod

  const uniqueMoveNames = [...new Set(pokemon.moves.map((move) => move.move.name))]
  const movesData = await pMap(
    uniqueMoveNames,
    async (name) => pokeapi.getByName<Move>('move', name),
    { concurrency: 20 }
  )

  const movesWithMachines = movesData.filter((move) => move.machines?.length > 0)
  const uniqueMachineUrls = [
    ...new Set(
      movesWithMachines.flatMap((move) => move.machines.map((machine) => machine.machine.url))
    ),
  ]
  const machinesData = await pMap(uniqueMachineUrls, (url) => pokeapi.getResource<Machine>(url), {
    concurrency: 5,
  })

  const machinesMap = new Map<string, Machine[]>()
  movesWithMachines.forEach((move) => {
    machinesMap.set(
      move.name,
      machinesData.filter((m) => m.move.name === move.name)
    )
  })

  const movesMap = Object.fromEntries(
    movesData.map((move) => [
      move.name,
      { ...move, machineItems: machinesMap.get(move.name) || [] },
    ])
  ) as Record<string, Move & { machineItems: Machine[] }>

  Object.keys(moveRowsByMethod).forEach((method) => {
    const methodKey = method as LearnMethodKey
    const methodMoves = pokemon.moves.filter((move) =>
      move.version_group_details.some((vgd) => vgd.move_learn_method.name === methodKey)
    )
    moveRowsByMethod[methodKey] = createMoveRows(methodMoves, movesMap, methodKey)
  })

  return moveRowsByMethod
}
