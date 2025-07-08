import Link from 'next/link'
import clsx from 'clsx/lite'
import pMap from 'p-map'
import type {
  PokemonSpecies,
  Pokemon,
  EggGroup,
  GrowthRate,
  StatElement,
} from 'pokedex-promise-v2'
import { Mars, Venus } from 'lucide-react'
import pokeapi from '@/lib/api/pokeapi'
import { StatLabels, StatKey, getTranslation } from '@/lib/utils/pokeapiHelpers'
import { Group } from '@visx/group'
import { Pie } from '@visx/shape'

const calculateCatchProbability = (captureRate: number) => {
  const a = captureRate / 3
  const captureValue = 65535 / Math.pow(255 / a, 0.1875)
  const captureProbability = Math.pow(captureValue / 65535, 4)
  return Math.fround(captureProbability) * 100
}

const convertHeight = (heightInDecimeters: number) => ({
  feet: Math.round(heightInDecimeters / 3.048).toFixed(0),
  inches: (Math.round(heightInDecimeters * 3.937) % 12).toFixed(0),
  meters: Math.fround(heightInDecimeters / 10).toFixed(1),
})

const convertWeight = (weightInHectograms: number) => ({
  pounds: Math.fround(weightInHectograms / 4.536).toFixed(1),
  kilograms: (weightInHectograms / 10).toFixed(1),
})

const calculateGenderRates = (genderRate: number) => ({
  maleRate: Math.fround((1 - genderRate / 8) * 100).toFixed(1),
  femaleRate: Math.fround((genderRate / 8) * 100).toFixed(1),
})

function MetadataCard({
  title,
  children,
}: {
  title: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-2',
        'inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800',
        'rounded-xl p-4'
      )}
    >
      <h2 className="mb-1 text-xs font-medium tracking-wide text-zinc-700 uppercase dark:text-zinc-300">
        {title}
      </h2>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  )
}

function ValueUnit({ value, unit }: { value: string | number; unit?: string }) {
  return (
    <p className="flex gap-x-1">
      <span className="text-base font-light">{value}</span>
      {unit && (
        <span className="text-base text-zinc-600 dark:text-zinc-400">
          {unit}
        </span>
      )}
    </p>
  )
}

function CatchRateMetadata({ catchRate }: { catchRate: number }) {
  const probability = calculateCatchProbability(catchRate).toFixed(2)

  return (
    <MetadataCard title="Catch rate">
      <ValueUnit value={catchRate} unit="/ 255" />
      <ValueUnit value={probability} unit="%" />
    </MetadataCard>
  )
}

function EffortValueYieldMetadata({ stats }: { stats: StatElement[] }) {
  const evStats = stats.filter((stat) => stat.effort > 0)

  if (evStats.length === 0) {
    return (
      <MetadataCard title="EV yield">
        <p>None</p>
      </MetadataCard>
    )
  }

  return (
    <MetadataCard title="EV yield">
      <ul className="flex flex-col">
        {evStats.map((stat) => (
          <li key={stat.stat.name} className="flex gap-x-1">
            <ValueUnit
              value={stat.effort}
              unit={StatLabels[stat.stat.name as StatKey]}
            />
          </li>
        ))}
      </ul>
    </MetadataCard>
  )
}

function SizeMetadata({ height, weight }: { height: number; weight: number }) {
  const { feet, inches, meters } = convertHeight(height)
  const { pounds, kilograms } = convertWeight(weight)

  return (
    <MetadataCard title="Size">
      <div className="flex flex-col gap-2">
        <div>
          <span className="mb-1 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Height
          </span>
          <ValueUnit value={meters} unit="m" />
        </div>
        <div>
          <span className="mb-1 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Weight
          </span>
          <ValueUnit value={kilograms} unit="kg" />
        </div>
      </div>
    </MetadataCard>
  )
}

function BreedingMetadata({
  hatchCounter,
  eggGroups,
}: {
  hatchCounter: number | null
  eggGroups: EggGroup[]
}) {
  return (
    <MetadataCard title="Breeding">
      <div className="flex flex-col gap-2">
        <div>
          <span className="mb-1 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Egg Groups
          </span>
          <div className="flex flex-wrap gap-2">
            {eggGroups.length > 0 ? (
              eggGroups.map((group, i) => (
                <span key={group.name}>
                  <Link
                    href={`/egg-group/${group.name}`}
                    className="font-medium text-blue-700 underline underline-offset-4 transition-colors hover:text-blue-800 hover:duration-0 dark:text-blue-300 dark:hover:text-blue-200"
                  >
                    {getTranslation(group.names, 'name')}
                  </Link>
                  {i < eggGroups.length - 1 && ','}
                </span>
              ))
            ) : (
              <span>—</span>
            )}
          </div>
        </div>
        <div>
          <span className="mb-1 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Hatch Cycles
          </span>
          <div>
            <span>{hatchCounter ? hatchCounter.toLocaleString() : '—'}</span>
          </div>
        </div>
      </div>
    </MetadataCard>
  )
}

function GenderRatioDonut({ male, female }: { male: number; female: number }) {
  const data = [
    { label: 'Male', value: male },
    { label: 'Female', value: female },
  ]
  const width = 128
  const height = 128
  const centerX = width / 2
  const centerY = height / 2
  const radius = 56
  const innerRadius = 50
  const genderClasses: Record<string, string> = {
    Male: 'text-blue-700 dark:text-blue-300',
    Female: 'text-pink-700 dark:text-pink-300',
  }

  return (
    <div className="relative">
      <svg
        width={width}
        height={height}
        aria-label="Gender ratio donut chart"
        role="img"
      >
        <Group top={centerY} left={centerX}>
          <Pie<{ label: string; value: number }>
            data={data}
            pieValue={(d) => d.value}
            outerRadius={radius}
            innerRadius={innerRadius}
            padAngle={male === 100 || female === 100 ? 0 : 0.02}
          >
            {(pie) =>
              pie.arcs.map((arc, i) => (
                <path
                  key={i}
                  d={pie.path(arc) || undefined}
                  className={clsx(
                    'fill-current',
                    genderClasses[arc.data.label]
                  )}
                />
              ))
            }
          </Pie>
        </Group>
      </svg>
      <div className="absolute top-1/2 left-1/2 flex size-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
        <div className="flex gap-x-1">
          <span className="flex flex-row items-center gap-x-1 text-blue-800 dark:text-blue-200">
            <Mars size={20} />
            <ValueUnit value={male} unit="%" />
          </span>
        </div>
        <div className="flex gap-x-1">
          <span className="flex flex-row items-center gap-x-1 text-base font-light text-pink-800 dark:text-pink-200">
            <Venus size={20} />
            <ValueUnit value={female} unit="%" />
          </span>
        </div>
      </div>
    </div>
  )
}

function GenderRatioMetadata({ genderRate }: { genderRate: number }) {
  if (genderRate === -1) {
    return (
      <MetadataCard title="Gender ratio">
        <p>Genderless</p>
      </MetadataCard>
    )
  }

  const { femaleRate, maleRate } = calculateGenderRates(genderRate)

  return (
    <MetadataCard title="Gender ratio">
      <div className="flex items-center">
        <GenderRatioDonut
          female={parseFloat(femaleRate)}
          male={parseFloat(maleRate)}
        />
      </div>
    </MetadataCard>
  )
}

function GrowthRateMetadata({ growthRate }: { growthRate: GrowthRate }) {
  const description = getTranslation(growthRate.descriptions, 'description')!
  const maxExperience = growthRate.levels.find(
    (level) => level.level === 100
  )!.experience

  return (
    <MetadataCard title="Growth rate">
      <ValueUnit value={maxExperience.toLocaleString()} unit="exp" />
      <ValueUnit value={description} />
    </MetadataCard>
  )
}

export default async function MonsterMetadata({
  species,
  pokemon,
}: {
  species: PokemonSpecies
  pokemon: Pokemon
}) {
  const eggGroups = await pMap(
    species.egg_groups,
    async (eggGroup) => {
      const resource = await pokeapi.getResource<EggGroup>(eggGroup.url)
      return resource
    },
    { concurrency: 4 }
  )

  const growthRate = await pokeapi.getResource<GrowthRate>(
    species.growth_rate.url
  )

  return (
    // <div
    //   className={clsx(
    //     // 'grid grid-cols-1 gap-4 @md:grid-cols-2 @lg:grid-cols-3 @4xl:grid-cols-6'
    //     // 'rounded-xl p-4'
    //     // 'inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800'
    //   )}
    // >
    <>
      <SizeMetadata height={pokemon.height} weight={pokemon.weight} />
      <GenderRatioMetadata genderRate={species.gender_rate} />
      <CatchRateMetadata catchRate={species.capture_rate} />
      <BreedingMetadata
        hatchCounter={species.hatch_counter}
        eggGroups={eggGroups}
      />
      <GrowthRateMetadata growthRate={growthRate} />
      <EffortValueYieldMetadata stats={pokemon.stats} />
    </>
    // </div>
  )
}
