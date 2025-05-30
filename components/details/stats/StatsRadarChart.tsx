import clsx from 'clsx/lite'
import type { Pokemon } from 'pokedex-promise-v2'
import { StatLabels, StatKey, StatLabelsFull } from '@/lib/utils/pokeapiHelpers'

const statAngleMap: Record<string, number> = {
  hp: 0, // top
  attack: 1, // top right
  defense: 2, // bottom right
  speed: 3, // bottom
  'special-defense': 4, // top left
  'special-attack': 5, // bottom left
}

export default function StatsRadarChart({ pokemon }: { pokemon: Pokemon }) {
  const generateSubdivisions = (length: number) => {
    return Array.from({ length }, (_, i) => Math.ceil((i + 1) * (50 / length)))
  }

  const generateHexagonPoints = (
    radius: number,
    centerX: number,
    centerY: number
  ) => {
    const points = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      points.push(`${x},${y}`)
    }
    return points.join(' ')
  }

  const dataPoints = pokemon.stats
    .slice() // Create a copy to avoid mutating original array
    .sort((a, b) => statAngleMap[a.stat.name] - statAngleMap[b.stat.name])
    .map((stat) => {
      const angleIndex = statAngleMap[stat.stat.name]
      const angle = (Math.PI / 3) * angleIndex - Math.PI / 2
      const x = 50 + (stat.base_stat / 255) * 50 * Math.cos(angle)
      const y = 50 + (stat.base_stat / 255) * 50 * Math.sin(angle)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="relative p-8">
      <div className="max-w-56">
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
            const angleIndex = statAngleMap[stat.stat.name]
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
          const fullLabel = StatLabelsFull[stat.stat.name as StatKey]
          const angleIndex = statAngleMap[stat.stat.name]
          const angle = (Math.PI / 3) * angleIndex - Math.PI / 2
          const x = 50 + 56 * Math.cos(angle)
          const y = 50 + 50 * Math.sin(angle)

          return (
            <div
              key={`label-${stat.stat.name}`}
              className="absolute top-0 left-0 flex w-14 -translate-x-1/2 -translate-y-1/2 flex-col"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <abbr
                title={fullLabel}
                aria-label={fullLabel}
                className={clsx(
                  'text-xs font-normal text-zinc-700 no-underline dark:text-zinc-300',
                  angleIndex === 0 && 'text-center',
                  angleIndex === 1 && 'text-left',
                  angleIndex === 2 && 'text-left',
                  angleIndex === 3 && 'text-center',
                  angleIndex === 4 && 'text-right',
                  angleIndex === 5 && 'text-right'
                )}
              >
                {StatLabels[stat.stat.name as StatKey]}
              </abbr>
              <p
                className={clsx(
                  'font-num text-lg font-semibold text-black tabular-nums dark:text-white',
                  angleIndex === 0 && 'text-center',
                  angleIndex === 1 && 'text-left',
                  angleIndex === 2 && 'text-left',
                  angleIndex === 3 && 'text-center',
                  angleIndex === 4 && 'text-right',
                  angleIndex === 5 && 'text-right'
                )}
              >
                {stat.base_stat}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
