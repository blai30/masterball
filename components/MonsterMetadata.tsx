'use client'

import Link from 'next/link'
import { EggGroup, GrowthRate, Stat } from 'pokedex-promise-v2'

export default function MonsterMetadata({
  genderRate,
  captureRate,
  height,
  weight,
  hatchCounter,
  eggGroups,
  growthRate,
  effortValueYield,
}: {
  genderRate: number
  captureRate: number
  height: number
  weight: number
  hatchCounter: number
  eggGroups: EggGroup[]
  growthRate: GrowthRate
  effortValueYield: Stat[]
}) {
  const language = 'en'

  const captureProbability = (captureRate: number) => {
    const a = captureRate / 3
    const captureValue = 65535 / Math.pow(255 / a, 0.1875)
    const captureProbability = Math.pow(captureValue / 65535, 4)
    return Math.fround(captureProbability) * 100
  }

  const eggGroupObjects = eggGroups.map((group) => {
    const groupName = group.names.find(
      (name) => name.language.name === language
    )!
    return {
      id: group.id,
      key: group.name,
      name: groupName.name,
    }
  })

  const maleRate = Math.fround((1 - genderRate / 8) * 100).toFixed(1)
  const femaleRate = Math.fround((genderRate / 8) * 100).toFixed(1)
  const heightFeet = Math.round(height / 3.048).toFixed(0)
  const heightInches = (Math.round(height * 3.937) % 12).toFixed(0)
  const heightMeters = Math.fround(height / 10).toFixed(1)
  const weightPounds = Math.fround(weight / 4.536).toFixed(1)
  const weightKilograms = (weight / 10).toFixed(1)
  const hatchSteps = (hatchCounter * 128).toLocaleString()

  return (
    <section className="grid grid-cols-2 gap-x-4 gap-y-6 px-4 sm:grid-cols-4 xl:grid-cols-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm/6 text-zinc-600 dark:text-zinc-400">
          Gender ratio
        </p>
        <div className="flex flex-col">
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-blue-800 dark:text-blue-200">{`♂️ ${maleRate}`}</span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">%</span>
          </p>
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-pink-800 dark:text-pink-200">{`♀️ ${femaleRate}`}</span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">%</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm/6 text-zinc-600 dark:text-zinc-400">
          Capture rate
        </p>
        <div className="flex flex-col">
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-black dark:text-white">
              {captureRate}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              / 255
            </span>
          </p>
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-black dark:text-white">
              {captureProbability(captureRate).toFixed(2)}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">%</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm/6 text-zinc-600 dark:text-zinc-400">Height</p>
        <div className="flex flex-col">
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-black dark:text-white">
              {heightFeet}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">ft</span>
            <span className="text-base font-light text-black dark:text-white">
              {heightInches}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">in</span>
          </p>
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-black dark:text-white">
              {heightMeters}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              meters
            </span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm/6 text-zinc-600 dark:text-zinc-400">Weight</p>
        <div className="flex flex-col">
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-black dark:text-white">
              {weightPounds}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              lbs
            </span>
          </p>
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-black dark:text-white">
              {weightKilograms}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">kg</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm/6 text-zinc-600 dark:text-zinc-400">
          Hatch counter
        </p>
        <div className="flex flex-col">
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-black dark:text-white">
              {hatchSteps}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              steps
            </span>
          </p>
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-black dark:text-white">
              {hatchCounter.toLocaleString()}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              cycles
            </span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm/6 text-zinc-600 dark:text-zinc-400">Egg group</p>
        <div className="flex flex-col">
          {eggGroupObjects.map((group) => (
            <Link
              key={group.key}
              href={`/egg-group/${group.key}`}
              className="text-base font-light text-blue-700 dark:text-blue-300 underline"
            >
              {group.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm/6 text-zinc-600 dark:text-zinc-400">
          Growth rate
        </p>
        <div className="flex flex-col">
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-black dark:text-white">
              {growthRate.levels[99].experience.toLocaleString()}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              points
            </span>
          </p>
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-black dark:text-white">
              {growthRate.name}
            </span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm/6 text-zinc-600 dark:text-zinc-400">
          Effort Value yield
        </p>
        <div className="flex flex-col">
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-black dark:text-white">
              {(3).toLocaleString()}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Attack
            </span>
          </p>
          <p className="flex items-baseline gap-x-2">
            <span className="text-base font-light text-black dark:text-white">
              {"that's it"}
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
