import { useEffect, useState } from 'react'
import type { Pokemon } from 'pokedex-promise-v2'
import {
  StatLabels,
  type StatKey,
  StatLabelsFull,
} from '@/lib/utils/pokeapi-helpers'

export default function StatsBarChart({ pokemon }: { pokemon: Pokemon }) {
  const statTotal = pokemon.stats.reduce((acc, stat) => acc + stat.base_stat, 0)
  // Animate each stat bar fill
  const [fillPercentages, setFillPercentages] = useState<number[]>(() =>
    pokemon.stats.map(() => 0)
  )

  useEffect(() => {
    // Animate to actual fill after mount
    const timeouts = pokemon.stats.map((stat, i) =>
      setTimeout(
        () => {
          setFillPercentages((prev) => {
            const next = [...prev]
            next[i] = Number(((stat.base_stat / 255) * 100).toFixed(4))
            return next
          })
        },
        // Stagger the animations
        100 + i * 80
      )
    )
    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [pokemon.stats])

  return (
    <div className="w-full">
      {/* Bar chart */}
      <ul className="flex flex-col">
        {pokemon.stats.map((stat, i) => {
          const fullLabel = StatLabelsFull[stat.stat.name as StatKey]
          return (
            <li
              key={stat.stat.name}
              className="flex flex-row items-center gap-3"
            >
              <p className="flex flex-row items-center justify-between">
                <abbr
                  title={fullLabel}
                  aria-label={fullLabel}
                  className="min-w-16 font-normal text-zinc-700 no-underline sm:min-w-20 lg:min-w-16 xl:min-w-20 dark:text-zinc-300"
                >
                  {StatLabels[stat.stat.name as StatKey]}
                </abbr>
                <span className="font-num min-w-10 text-right text-black tabular-nums sm:min-w-12 lg:min-w-10 xl:min-w-12 dark:text-white">
                  {stat.base_stat.toLocaleString()}
                </span>
              </p>

              {/* Progress bar visualization */}
              <div className="flex h-5 w-full flex-row items-center">
                <div className="relative h-full max-w-full flex-grow rounded-sm inset-ring-1 inset-ring-zinc-300 dark:inset-ring-zinc-700">
                  {/* Tick marks */}
                  <div className="absolute top-0 bottom-0 grid w-full grid-cols-5 divide-x-1 divide-zinc-300 dark:divide-zinc-700">
                    {[...Array(5)].map((_, index) => (
                      <div key={`${stat.stat.name}-tick-${index}`} />
                    ))}
                  </div>
                  {/* Fill bar */}
                  <div
                    className={
                      'absolute h-full rounded-l-sm bg-black/60 inset-ring-1 inset-ring-black transition-all duration-700 dark:bg-white/60 dark:inset-ring-white'
                    }
                    style={{ width: `${fillPercentages[i]}%` }}
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <p>—</p>
      <div className="flex flex-row items-center gap-3">
        <p className="flex flex-row items-center justify-between">
          <abbr
            title="Base stat total"
            aria-label="Base stat total"
            className="min-w-16 font-normal text-zinc-700 no-underline sm:min-w-20 lg:min-w-16 xl:min-w-20 dark:text-zinc-300"
          >
            Total
          </abbr>
          <span className="font-num min-w-10 text-right text-black tabular-nums sm:min-w-12 lg:min-w-10 xl:min-w-12 dark:text-white">
            {statTotal.toLocaleString()}
          </span>
        </p>
      </div>
    </div>
  )
}
