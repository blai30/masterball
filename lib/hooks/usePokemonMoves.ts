import { useMemo } from 'react'
import { Machine, Move, MoveElement } from 'pokedex-promise-v2'
import { useVersionGroup } from '@/lib/stores/version-group'
import {
  getTranslation,
  TypeKey,
  DamageClassKey,
} from '@/lib/utils/pokeapiHelpers'

export type LearnMethod =
  | 'form-change'
  | 'level-up'
  | 'machine'
  | 'tutor'
  | 'egg'

export type MoveRow = {
  rowLabel: string
  key: string
  type: TypeKey
  damageClass: DamageClassKey
  name: string
  power: number | string
  accuracy: number | string
  pp: number
}

export function usePokemonMoves(
  variant: LearnMethod,
  moves: MoveElement[],
  movesMap: Record<string, Move & { machineItems: Machine[] }>
) {
  const { versionGroup } = useVersionGroup()

  return useMemo(() => {
    // Create efficient lookup for filtering
    const filteredMoves = moves.filter((move) =>
      move.version_group_details.some(
        (detail) =>
          detail.move_learn_method.name === variant &&
          detail.version_group.name === versionGroup
      )
    )

    return filteredMoves
      .map((move) => {
        const resource = movesMap[move.move.name]
        if (!resource) return null // Skip if resource isn't available

        const name = getTranslation(resource.names, 'name')!

        let rowLabel = ''
        const versionDetail = move.version_group_details.find(
          (detail) =>
            detail.version_group.name === versionGroup &&
            detail.move_learn_method.name === variant
        )

        if (variant === 'level-up' && versionDetail) {
          rowLabel =
            versionDetail.level_learned_at === 0
              ? 'Evolve'
              : versionDetail.level_learned_at.toString()
        } else if (variant === 'machine' && resource.machineItems?.length) {
          const machine = resource.machineItems.find(
            (m) => m.version_group.name === versionGroup
          )
          rowLabel = machine?.item.name.toLocaleUpperCase() || ''
        }

        return {
          rowLabel,
          key: move.move.name,
          type: resource.type.name as TypeKey,
          damageClass: resource.damage_class.name as DamageClassKey,
          name,
          power: resource.power ?? '—',
          accuracy: resource.accuracy ?? '—',
          pp: resource.pp!,
        }
      })
      .filter(Boolean) as MoveRow[]
  }, [moves, movesMap, variant, versionGroup])
}
