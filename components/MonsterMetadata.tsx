'use client'

import Link from 'next/link'
import { EggGroup, GrowthRate, Stat } from 'pokedex-promise-v2'
import MetadataEntry from './MetadataEntry'

export default function MonsterMetadata({
  height,
  weight,
  genderRate,
  captureRate,
  hatchCounter,
  eggGroups,
  growthRate,
  effortValueYield,
}: {
  height: number
  weight: number
  genderRate: number
  captureRate: number
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
    const groupName =
      group.names.find((name) => name.language.name === language) ??
      group.names.find((name) => name.language.name === 'en')!
    return {
      id: group.id,
      key: group.name,
      name: groupName.name,
    }
  })

  const maxExperience = growthRate.levels.find(
    (level) => level.level === 100
  )!.experience

  const growthRateName =
    growthRate.descriptions.find(
      (description) => description.language.name === language
    ) ??
    growthRate.descriptions.find(
      (description) => description.language.name === 'en'
    )!

  // Convert from decimeters to feet (floor) + inches (remainder) and meters.
  const heightFeet = Math.round(height / 3.048).toFixed(0)
  const heightInches = (Math.round(height * 3.937) % 12).toFixed(0)
  const heightMeters = Math.fround(height / 10).toFixed(1)

  // Convert from hectograms to pounds and kilograms.
  const weightPounds = Math.fround(weight / 4.536).toFixed(1)
  const weightKilograms = (weight / 10).toFixed(1)

  // Gender ratio is presented as a multiple of 8.
  const maleRate = Math.fround((1 - genderRate / 8) * 100).toFixed(1)
  const femaleRate = Math.fround((genderRate / 8) * 100).toFixed(1)

  // Multiply hatch cycles by number of steps in a cycle.
  const hatchSteps = (hatchCounter * 128).toLocaleString()

  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2">
      <MetadataEntry title={'Height'}>
        <div className="flex flex-col">
          <p className="flex gap-x-1">
            <span className="text-base font-light text-black dark:text-white">
              {heightFeet}
            </span>
            <span className="text-base text-zinc-600 dark:text-zinc-400">
              ft
            </span>
            <span className="text-base font-light text-black dark:text-white">
              {heightInches}
            </span>
            <span className="text-base text-zinc-600 dark:text-zinc-400">
              in
            </span>
          </p>
          <p className="flex gap-x-1">
            <span className="text-base font-light text-black dark:text-white">
              {heightMeters}
            </span>
            <span className="text-base text-zinc-600 dark:text-zinc-400">
              meters
            </span>
          </p>
        </div>
      </MetadataEntry>

      <MetadataEntry title={'Weight'}>
        <div className="flex flex-col">
          <p className="flex gap-x-1">
            <span className="text-base font-light text-black dark:text-white">
              {weightPounds}
            </span>
            <span className="text-base text-zinc-600 dark:text-zinc-400">
              lbs
            </span>
          </p>
          <p className="flex gap-x-1">
            <span className="text-base font-light text-black dark:text-white">
              {weightKilograms}
            </span>
            <span className="text-base text-zinc-600 dark:text-zinc-400">
              kg
            </span>
          </p>
        </div>
      </MetadataEntry>

      <MetadataEntry title={'Gender ratio'}>
        <div className="flex flex-col">
          <div className="flex gap-x-1">
            <span className="flex flex-row items-center gap-x-2 text-base font-light text-blue-800 dark:text-blue-200">
              <svg fill="currentColor" className="size-4">
                <path d="M9.5 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.707L9.871 6.836a5 5 0 1 1-.707-.707L13.293 2zM6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8" />
              </svg>
              <p>{maleRate}</p>
            </span>
            <span className="text-base text-zinc-600 dark:text-zinc-400">
              %
            </span>
          </div>
          <div className="flex gap-x-1">
            <span className="flex flex-row items-center gap-x-2 text-base font-light text-pink-800 dark:text-pink-200">
              <svg fill="currentColor" className="size-4">
                <path d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13h-2a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5" />
              </svg>
              <p>{femaleRate}</p>
            </span>
            <span className="text-base text-zinc-600 dark:text-zinc-400">
              %
            </span>
          </div>
        </div>
      </MetadataEntry>

      <MetadataEntry title={'Capture rate'}>
        <div className="flex flex-col">
          <p className="flex gap-x-1">
            <span className="text-base font-light text-black dark:text-white">
              {captureRate}
            </span>
            <span className="text-base text-zinc-600 dark:text-zinc-400">
              / 255
            </span>
          </p>
          <p className="flex gap-x-1">
            <span className="text-base font-light text-black dark:text-white">
              {captureProbability(captureRate).toFixed(2)}
            </span>
            <span className="text-base text-zinc-600 dark:text-zinc-400">
              %
            </span>
          </p>
        </div>
      </MetadataEntry>

      <MetadataEntry title={'Hatch counter'}>
        <div className="flex flex-col">
          <p className="flex gap-x-1">
            <span className="text-base font-light text-black dark:text-white">
              {hatchSteps}
            </span>
            <span className="text-base text-zinc-600 dark:text-zinc-400">
              steps
            </span>
          </p>
          <p className="flex gap-x-1">
            <span className="text-base font-light text-black dark:text-white">
              {hatchCounter.toLocaleString()}
            </span>
            <span className="text-base text-zinc-600 dark:text-zinc-400">
              cycles
            </span>
          </p>
        </div>
      </MetadataEntry>

      <MetadataEntry title={'Egg group'}>
        <div className="flex flex-col">
          {eggGroupObjects.map((group) => (
            <Link
              key={group.key}
              href={`/egg-group/${group.key}`}
              className="text-base font-light text-blue-700 underline dark:text-blue-300"
            >
              {group.name}
            </Link>
          ))}
        </div>
      </MetadataEntry>

      <MetadataEntry title={'Growth rate'}>
        <div className="flex flex-col">
          <p className="flex gap-x-1">
            <span className="text-base font-light text-black dark:text-white">
              {maxExperience.toLocaleString()}
            </span>
            <span className="text-base text-zinc-600 dark:text-zinc-400">
              points
            </span>
          </p>
          <p className="flex gap-x-1">
            <span className="text-base font-light text-black dark:text-white">
              {growthRateName.description}
            </span>
          </p>
        </div>
      </MetadataEntry>

      <MetadataEntry title={'Effort Value yield'}>
        <div className="flex flex-col">
          <p className="flex gap-x-1">
            <span className="text-base font-light text-black dark:text-white">
              {(3).toLocaleString()}
            </span>
            <span className="text-base text-zinc-600 dark:text-zinc-400">
              Attack
            </span>
          </p>
          <p className="flex gap-x-1">
            <span className="text-base font-light text-black dark:text-white">
              {"that's it"}
            </span>
          </p>
        </div>
      </MetadataEntry>
    </section>
  )
}
