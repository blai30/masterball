import {
  getTranslation,
  StatLabels,
  StatName,
} from '@/lib/utils/pokeapiHelpers'
import { Pokemon, Stat } from 'pokedex-promise-v2'

// Map stats to their desired angle indices
const statAngleMap: Record<string, number> = {
  hp: 0, // top
  attack: 1, // top right
  defense: 2, // bottom right
  speed: 3, // bottom
  'special-defense': 4, // top left
  'special-attack': 5, // bottom left
}

export default function StatsRadarChart({
  pokemon,
  stats,
}: {
  pokemon: Pokemon
  stats: Stat[]
}) {
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
      const angle = (Math.PI / 3) * i - Math.PI / 2 // Start from top (subtract PI/2)
      const x = centerX + radius * Math.cos(angle) // Use cos for x
      const y = centerY + radius * Math.sin(angle) // Use sin for y
      points.push(`${x},${y}`)
    }
    return points.join(' ')
  }

  const dataPoints = pokemon.stats
    .slice() // Create a copy to avoid mutating original array
    .sort((a, b) => statAngleMap[a.stat.name] - statAngleMap[b.stat.name])
    .map((stat) => {
      const angleIndex = statAngleMap[stat.stat.name]
      const angle = (Math.PI / 3) * angleIndex - Math.PI / 2 // Start from top
      const x = 50 + (stat.base_stat / 255) * 50 * Math.cos(angle)
      const y = 50 + (stat.base_stat / 255) * 50 * Math.sin(angle)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="xs:h-80 xs:w-80 relative p-8">
      <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
        {generateSubdivisions(5).map((value, index) => (
          <polygon
            key={index}
            points={generateHexagonPoints(value, 50, 50)}
            className="fill-none stroke-zinc-300 stroke-[0.5] dark:stroke-zinc-700"
          />
        ))}
        <polygon
          points={dataPoints}
          className="fill-black/60 stroke-black stroke-[0.5] dark:fill-white/60 dark:stroke-white"
        />
        {/* Add dots at stat points */}
        {pokemon.stats
          .sort((a, b) => statAngleMap[a.stat.name] - statAngleMap[b.stat.name])
          .map((stat) => {
            const angleIndex = statAngleMap[stat.stat.name]
            const angle = (Math.PI / 3) * angleIndex - Math.PI / 2
            const x = 50 + (stat.base_stat / 255) * 50 * Math.cos(angle)
            const y = 50 + (stat.base_stat / 255) * 50 * Math.sin(angle)
            return (
              <circle
                key={stat.stat.name}
                cx={x}
                cy={y}
                r="1"
                className="fill-black dark:fill-white"
              />
            )
          })}
      </svg>
      {/* Stat labels and their values */}
      {stats.map((stat) => {
        const name = getTranslation(stat.names, 'name')
        const pokemonStat = pokemon.stats.find(
          (s) => s.stat.name === stat.name
        )!
        const angleIndex = statAngleMap[stat.name]
        const angle = (Math.PI / 3) * angleIndex - Math.PI / 2
        const x = 50 + 50 * Math.cos(angle)
        const y = 50 + 50 * Math.sin(angle)

        return (
          <div
            key={stat.id}
            className="absolute top-0 left-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <p className="text-xs font-normal text-black dark:text-white">
              {StatLabels[stat.name as StatName]}
            </p>
            <p className="font-num text-lg font-semibold text-black dark:text-white">
              {pokemonStat.base_stat}
            </p>
          </div>
        )
      })}
    </div>
  )
}
