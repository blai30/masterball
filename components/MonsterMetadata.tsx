'use client'

import { EggGroup, GrowthRate, Stat } from 'pokedex-promise-v2'

// export default function MonsterMetadata({
//   genderRate,
//   captureRate,
//   height,
//   weight,
//   hatchCounter,
//   eggGroups,
//   growthRate,
//   effortValueYield,
// }: {
//   genderRate: { gender: string; value: number }[]
//   captureRate: number
//   height: number
//   weight: number
//   hatchCounter: number
//   eggGroups: EggGroup[]
//   growthRate: GrowthRate
//   effortValueYield: Stat
// }) {
export default function MonsterMetadata() {
  const captureProbability = (captureRate: number) => {
    const a = captureRate / 3
    const captureValue = 65535 / Math.pow(255 / a, 0.1875)
    const captureProbability = Math.pow(captureValue / 65535, 4)
    return captureProbability * 100
  }

  return (
    <section className="grid grid-cols-2 gap-x-4 gap-y-6 px-4 sm:grid-cols-4 xl:grid-cols-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm/6 text-zinc-400">Gender ratio</p>
        <div className="flex flex-col">
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-white">♂️ 69.5</span>
            <span className="text-sm text-zinc-400">%</span>
          </p>
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-white">♀️ 30.5</span>
            <span className="text-sm text-zinc-400">%</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm/6 text-zinc-400">Capture rate</p>
        <div className="flex flex-col">
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-white">45</span>
            <span className="text-sm text-zinc-400">/ 255</span>
          </p>
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-white">
              {captureProbability(45).toFixed(2)}
            </span>
            <span className="text-sm text-zinc-400">%</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm/6 text-zinc-400">Height</p>
        <div className="flex flex-col">
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-white">{'4'}</span>
            <span className="text-sm text-zinc-400">ft</span>
            <span className="text-base font-light text-white">{'11'}</span>
            <span className="text-sm text-zinc-400">in</span>
          </p>
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-white">1.5</span>
            <span className="text-sm text-zinc-400">meters</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm/6 text-zinc-400">Weight</p>
        <div className="flex flex-col">
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-white">180.6</span>
            <span className="text-sm text-zinc-400">lbs</span>
          </p>
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-white">81.9</span>
            <span className="text-sm text-zinc-400">kg</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm/6 text-zinc-400">Hatch counter</p>
        <div className="flex flex-col">
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-white">
              {(2560).toLocaleString()}
            </span>
            <span className="text-sm text-zinc-400">steps</span>
          </p>
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-white">
              {(20).toLocaleString()}
            </span>
            <span className="text-sm text-zinc-400">cycles</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm/6 text-zinc-400">Egg group</p>
        <div className="flex flex-col">
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-white">Monster</span>
          </p>
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-white">Water 1</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm/6 text-zinc-400">Experience Growth</p>
        <div className="flex flex-col">
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-white">
              {(1059862).toLocaleString()}
            </span>
            <span className="text-sm text-zinc-400">points</span>
          </p>
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-white">Medium Slow</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm/6 text-zinc-400">Effort Value yield</p>
        <div className="flex flex-col">
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-white">
              {(3).toLocaleString()}
            </span>
            <span className="text-sm text-zinc-400">Attack</span>
          </p>
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-white">
              {"that's it"}
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
