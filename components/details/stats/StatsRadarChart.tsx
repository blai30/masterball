import clsx from 'clsx/lite'
import type { Pokemon } from 'pokedex-promise-v2'
import { StatLabels, StatKey, StatLabelsFull } from '@/lib/utils/pokeapiHelpers'

// Stat order for radar chart
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
  [StatKey.Speed]: 'text-center',
  [StatKey.SpecialDefense]: 'text-right',
  [StatKey.SpecialAttack]: 'text-right',
}

export default function StatsRadarChart({ pokemon }: { pokemon: Pokemon }) {
  const generateSubdivisions = (length: number) =>
    Array.from({ length }, (_, i) => Math.ceil((i + 1) * (50 / length)))

  const generateHexagonPoints = (
    radius: number,
    centerX: number,
    centerY: number
  ) =>
    Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      return `${x},${y}`
    }).join(' ')

  const dataPoints = pokemon.stats
    .slice()
    .sort(
      (a, b) =>
        statOrder.indexOf(a.stat.name as StatKey) -
        statOrder.indexOf(b.stat.name as StatKey)
    )
    .map((stat) => {
      const angleIndex = statOrder.indexOf(stat.stat.name as StatKey)
      const angle = (Math.PI / 3) * angleIndex - Math.PI / 2
      const x = 50 + (stat.base_stat / 255) * 50 * Math.cos(angle)
      const y = 50 + (stat.base_stat / 255) * 50 * Math.sin(angle)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="relative m-4 mt-10 max-w-80 p-8">
      <svg viewBox="0 0 100 100" className="w-full overflow-visible">
        {Array.from({ length: pokemon.stats.length }, (_, i) => {
          const angle = (Math.PI / 3) * i - Math.PI / 2
          const x = 50 + 50 * Math.cos(angle)
          const y = 50 + 50 * Math.sin(angle)
          return (
            <line
              key={`grid-line-${i}`}
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              className="stroke-zinc-300 stroke-[0.5] dark:stroke-zinc-700"
            />
          )
        })}
        {generateSubdivisions(5).map((value, index) => (
          <polygon
            key={index}
            points={generateHexagonPoints(value, 50, 50)}
            className="fill-none stroke-zinc-300 stroke-[0.5] dark:stroke-zinc-700"
          />
        ))}
        <polygon
          points={dataPoints}
          className="fill-black/60 stroke-black stroke-1 dark:fill-white/60 dark:stroke-white"
        />
        {/* Add dots at stat points */}
        {pokemon.stats.map((stat) => {
          const angleIndex = statOrder.indexOf(stat.stat.name as StatKey)
          const angle = (Math.PI / 3) * angleIndex - Math.PI / 2
          const statX = 50 + (stat.base_stat / 255) * 50 * Math.cos(angle)
          const statY = 50 + (stat.base_stat / 255) * 50 * Math.sin(angle)

          return (
            <circle
              key={`dot-${stat.stat.name}`}
              cx={statX}
              cy={statY}
              r="1.2"
              className="fill-black dark:fill-white"
            />
          )
        })}
      </svg>
      {/* Stat labels and their values */}
      {pokemon.stats.map((stat) => {
        const { name } = stat.stat
        const angleIndex = statOrder.indexOf(name as StatKey)
        const angle = (Math.PI / 3) * angleIndex - Math.PI / 2
        const x = 50 + 56 * Math.cos(angle)
        const y = 50 + 50 * Math.sin(angle)
        const align = labelClasses[name as StatKey]
        return (
          <div
            key={`label-${name}`}
            className="absolute top-0 left-0 flex w-14 -translate-x-1/2 -translate-y-1/2 flex-col"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <abbr
              title={StatLabelsFull[name as StatKey]}
              aria-label={StatLabelsFull[name as StatKey]}
              className={clsx(
                'text-xs font-normal text-zinc-700 no-underline dark:text-zinc-300',
                align
              )}
            >
              {StatLabels[name as StatKey]}
            </abbr>
            <p
              className={clsx(
                'font-num text-lg font-semibold text-black tabular-nums dark:text-white',
                align
              )}
            >
              {stat.base_stat}
            </p>
          </div>
        )
      })}
    </div>
  )
}
