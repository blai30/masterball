import { Group } from '@visx/group'
import { scaleLinear } from '@visx/scale'
import { Polygon } from '@visx/shape'
import clsx from 'clsx/lite'
import { motion } from 'motion/react'
import type { Pokemon } from 'pokedex-promise-v2'

import { STATS, type StatKey } from '@/lib/domain/stats'

const statOrder: StatKey[] = [
  'hp',
  'attack',
  'defense',
  'speed',
  'special-defense',
  'special-attack',
]

const labelClasses: Record<StatKey, string> = {
  hp: 'text-center',
  attack: 'text-left',
  defense: 'text-left',
  'special-attack': 'text-right',
  'special-defense': 'text-right',
  speed: 'text-center',
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

  // Final stat values
  const finalStats: Record<StatKey, number> = {
    hp: statData.find((s) => s.key === 'hp')?.value ?? 0,
    attack: statData.find((s) => s.key === 'attack')?.value ?? 0,
    defense: statData.find((s) => s.key === 'defense')?.value ?? 0,
    'special-attack': statData.find((s) => s.key === 'special-attack')?.value ?? 0,
    'special-defense': statData.find((s) => s.key === 'special-defense')?.value ?? 0,
    speed: statData.find((s) => s.key === 'speed')?.value ?? 0,
  }

  const getPoints = (stats: Record<StatKey, number>) =>
    statOrder
      .map((key, i) => {
        const angle = (Math.PI * 2 * i) / statOrder.length - Math.PI / 2
        const r = scale(stats[key])
        return [RADAR_CENTER + r * Math.cos(angle), RADAR_CENTER + r * Math.sin(angle)]
      })
      .map(([x, y]) => `${x},${y}`)
      .join(' ')

  const getLabelPosition = (i: number) => {
    const angle = (Math.PI * 2 * i) / statOrder.length - Math.PI / 2
    const x = RADAR_CENTER + (RADAR_RADIUS + 44) * Math.cos(angle)
    const y = RADAR_CENTER + (RADAR_RADIUS + 26) * Math.sin(angle)
    return { x, y }
  }

  return (
    <div className="xs:ml-0 relative mt-8 mb-4 -ml-2">
      <svg width={RADAR_SIZE} height={RADAR_SIZE} className="w-full overflow-visible">
        <Group top={0} left={0}>
          {/* Grid levels */}
          {Array.from({ length: LEVELS }, (_, i) => {
            const r = scale(MAX_STAT * ((i + 1) / LEVELS))
            const points: [number, number][] = statOrder.map((_, idx) => {
              const angle = (Math.PI * 2 * idx) / statOrder.length - Math.PI / 2
              return [RADAR_CENTER + r * Math.cos(angle), RADAR_CENTER + r * Math.sin(angle)] as [
                number,
                number,
              ]
            })
            return (
              <Polygon
                key={`grid-${r}`}
                points={points}
                className="fill-none stroke-zinc-300 stroke-1 dark:stroke-zinc-700"
              />
            )
          })}
          {/* Stat axis lines */}
          {statOrder.map((key, i) => {
            const angle = (Math.PI * 2 * i) / statOrder.length - Math.PI / 2
            const x = RADAR_CENTER + RADAR_RADIUS * Math.cos(angle)
            const y = RADAR_CENTER + RADAR_RADIUS * Math.sin(angle)
            return (
              <line
                key={`axis-${key}`}
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
            fill="rgba(0,0,0,0.6)"
            className="fill-black/60 stroke-black stroke-2 dark:fill-white/60 dark:stroke-white"
            initial={{
              points: getPoints({
                hp: 0,
                attack: 0,
                defense: 0,
                'special-attack': 0,
                'special-defense': 0,
                speed: 0,
              }),
            }}
            whileInView={{ points: getPoints(finalStats) }}
            viewport={{ once: true }}
            transition={{ ease: 'easeInOut', duration: 0.6, delay: 0.2 }}
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
              className="overflow-visible"
            >
              <div className={clsx('flex w-14 flex-col', align)}>
                <abbr
                  title={STATS[key].full}
                  aria-label={STATS[key].full}
                  className={clsx(
                    'text-xs font-normal text-zinc-700 no-underline dark:text-zinc-300',
                    align
                  )}
                >
                  {STATS[key].short}
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
