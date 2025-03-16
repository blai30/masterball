import type { StatElement } from 'pokedex-promise-v2'
import { StatLabels, StatKey } from '@/lib/utils/pokeapiHelpers'

export default function EffortValueYieldMetadata({
  stats,
}: {
  stats: StatElement[]
}) {
  const title = 'Effort Value yield'
  const evStats = stats.filter((stat) => stat.effort > 0)

  return (
    <div className="flex flex-col gap-2 rounded-lg">
      <p className="text-sm/6 text-zinc-600 dark:text-zinc-400">{title}</p>
      <ul className="flex flex-col">
        {evStats.map((stat) => (
          <li key={stat.stat.name} className="flex gap-x-1">
            <span className="text-base font-light text-black dark:text-white">
              {stat.effort}
            </span>
            <span className="text-base text-zinc-600 dark:text-zinc-400">
              {StatLabels[stat.stat.name as StatKey]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
