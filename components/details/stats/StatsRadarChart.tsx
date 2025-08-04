import { useEffect, useState } from 'react'
import clsx from 'clsx/lite'
import { motion } from 'motion/react'
import type { Pokemon } from 'pokedex-promise-v2'
import { Group } from '@visx/group'
import { Polygon } from '@visx/shape'
import { scaleLinear } from '@visx/scale'
import {
  StatLabels,
  StatKey,
  StatLabelsFull,
} from '@/lib/utils/pokeapi-helpers'

const statOrder: StatKey[] = [
  StatKey.Hp,
  StatKey.Attack,
  StatKey.Defense,
  StatKey.Speed,
  StatKey.SpecialDefense,
  StatKey.SpecialAttack,
]

const labelClasses: Record<StatKey, string> = {
  [StatKey.Hp]: 'text-center',
  [StatKey.Attack]: 'text-left',
  [StatKey.Defense]: 'text-left',
  [StatKey.SpecialAttack]: 'text-right',
  [StatKey.SpecialDefense]: 'text-right',
  [StatKey.Speed]: 'text-center',
}

type StatDatum = {
  key: StatKey
  value: number
}

const RADAR_SIZE = 320
const RADAR_RADIUS = 120
const RADAR_CENTER = RADAR_SIZE / 2
const MAX_STAT = 255
const LEVELS = 5

export default function StatsRadarChart({ pokemon }: { pokemon: Pokemon }) {
  // Map stats to statOrder
  const statData: StatDatum[] = statOrder.map((key) => {
    const stat = pokemon.stats.find((s) => s.stat.name === key)!
    return { key, value: stat.base_stat }
  })

  const scale = scaleLinear({
    domain: [0, MAX_STAT],
    range: [0, RADAR_RADIUS],
  })

  // Animation state for each stat
  const [animatedStats, setAnimatedStats] = useState<Record<StatKey, number>>({
    [StatKey.Hp]: 0,
    [StatKey.Attack]: 0,
    [StatKey.Defense]: 0,
    [StatKey.SpecialAttack]: 0,
    [StatKey.SpecialDefense]: 0,
    [StatKey.Speed]: 0,
  })

  // Final stat values
  const finalStats: Record<StatKey, number> = {
    [StatKey.Hp]: statData.find((s) => s.key === StatKey.Hp)?.value ?? 0,
    [StatKey.Attack]:
      statData.find((s) => s.key === StatKey.Attack)?.value ?? 0,
    [StatKey.Defense]:
      statData.find((s) => s.key === StatKey.Defense)?.value ?? 0,
    [StatKey.SpecialAttack]:
      statData.find((s) => s.key === StatKey.SpecialAttack)?.value ?? 0,
    [StatKey.SpecialDefense]:
      statData.find((s) => s.key === StatKey.SpecialDefense)?.value ?? 0,
    [StatKey.Speed]: statData.find((s) => s.key === StatKey.Speed)?.value ?? 0,
  }

  // Animate stats on mount with staggered timing
  useEffect(() => {
    // Reset all stats to 0 first
    setAnimatedStats({
      [StatKey.Hp]: 0,
      [StatKey.Attack]: 0,
      [StatKey.Defense]: 0,
      [StatKey.SpecialAttack]: 0,
      [StatKey.SpecialDefense]: 0,
      [StatKey.Speed]: 0,
    })

    // Animate each stat with staggered timing
    const timeouts = statOrder.map((key, i) =>
      setTimeout(
        () => {
          setAnimatedStats((prev) => ({
            ...prev,
            [key]: finalStats[key],
          }))
        },
        // Stagger the animations
        // 200 + i * 100
        200
      )
    )

    return () => timeouts.forEach(clearTimeout)
  }, [
    finalStats[StatKey.Hp],
    finalStats[StatKey.Attack],
    finalStats[StatKey.Defense],
    finalStats[StatKey.SpecialAttack],
    finalStats[StatKey.SpecialDefense],
    finalStats[StatKey.Speed],
  ])

  const getLabelPosition = (i: number) => {
    const angle = (Math.PI * 2 * i) / statOrder.length - Math.PI / 2
    const x = RADAR_CENTER + (RADAR_RADIUS + 44) * Math.cos(angle)
    const y = RADAR_CENTER + (RADAR_RADIUS + 26) * Math.sin(angle)
    return { x, y }
  }

  return (
    <div className="xs:ml-0 relative mt-8 mb-4 -ml-2">
      <svg
        width={RADAR_SIZE}
        height={RADAR_SIZE}
        className="w-full overflow-visible"
      >
        <Group top={0} left={0}>
          {/* Grid levels */}
          {Array.from({ length: LEVELS }, (_, i) => {
            const r = scale(MAX_STAT * ((i + 1) / LEVELS))
            const points: [number, number][] = statOrder.map((_, idx) => {
              const angle = (Math.PI * 2 * idx) / statOrder.length - Math.PI / 2
              return [
                RADAR_CENTER + r * Math.cos(angle),
                RADAR_CENTER + r * Math.sin(angle),
              ] as [number, number]
            })
            return (
              <Polygon
                key={`grid-${i}`}
                points={points}
                className="fill-none stroke-zinc-300 stroke-1 dark:stroke-zinc-700"
              />
            )
          })}
          {/* Stat axis lines */}
          {statOrder.map((_, i) => {
            const angle = (Math.PI * 2 * i) / statOrder.length - Math.PI / 2
            const x = RADAR_CENTER + RADAR_RADIUS * Math.cos(angle)
            const y = RADAR_CENTER + RADAR_RADIUS * Math.sin(angle)
            return (
              <line
                key={`axis-${i}`}
                x1={RADAR_CENTER}
                y1={RADAR_CENTER}
                x2={x}
                y2={y}
                className="stroke-zinc-300 stroke-1 dark:stroke-zinc-700"
              />
            )
          })}
          {/* Radar polygon */}
          <motion.polygon
            points={statOrder
              .map((key, i) => {
                const angle = (Math.PI * 2 * i) / statOrder.length - Math.PI / 2
                const r = scale(animatedStats[key])
                return [
                  RADAR_CENTER + r * Math.cos(angle),
                  RADAR_CENTER + r * Math.sin(angle),
                ]
              })
              .map(([x, y]) => `${x},${y}`)
              .join(' ')}
            fill="rgba(0,0,0,0.6)"
            className="fill-black/60 stroke-black stroke-2 dark:fill-white/60 dark:stroke-white"
            animate={{
              points: statOrder
                .map((key, i) => {
                  const angle =
                    (Math.PI * 2 * i) / statOrder.length - Math.PI / 2
                  const r = scale(animatedStats[key])
                  return [
                    RADAR_CENTER + r * Math.cos(angle),
                    RADAR_CENTER + r * Math.sin(angle),
                  ]
                })
                .map(([x, y]) => `${x},${y}`)
                .join(' '),
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </Group>
        {/* Stat labels and values */}
        {statOrder.map((key, i) => {
          const { x, y } = getLabelPosition(i)
          const align = labelClasses[key]
          return (
            <foreignObject
              key={`label-${key}`}
              x={x - 28}
              y={y - 18}
              width={56}
              height={36}
              style={{ overflow: 'visible' }}
            >
              <div className={clsx('flex w-14 flex-col', align)}>
                <abbr
                  title={StatLabelsFull[key]}
                  aria-label={StatLabelsFull[key]}
                  className={clsx(
                    'text-xs font-normal text-zinc-700 no-underline dark:text-zinc-300',
                    align
                  )}
                >
                  {StatLabels[key]}
                </abbr>
                <p
                  className={clsx(
                    'font-num text-lg font-semibold text-black tabular-nums dark:text-white',
                    align
                  )}
                >
                  {finalStats[key]}
                </p>
              </div>
            </foreignObject>
          )
        })}
      </svg>
    </div>
  )
}
