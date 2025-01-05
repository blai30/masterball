'use client'

export default function HeightMetadata({ height }: { height: number }) {
  const title = 'Height'

  // Convert from decimeters to feet (floor) + inches (remainder) and meters.
  const heightFeet = Math.round(height / 3.048).toFixed(0)
  const heightInches = (Math.round(height * 3.937) % 12).toFixed(0)
  const heightMeters = Math.fround(height / 10).toFixed(1)

  return (
    <div className="flex flex-col gap-2 rounded-lg p-4">
      <p className="text-sm/6 text-zinc-600 dark:text-zinc-400">{title}</p>
      <div className="flex flex-col">
        <p className="flex gap-x-1">
          <span className="text-base font-light text-black dark:text-white">
            {heightFeet}
          </span>
          <span className="text-base text-zinc-600 dark:text-zinc-400">ft</span>
          <span className="text-base font-light text-black dark:text-white">
            {heightInches}
          </span>
          <span className="text-base text-zinc-600 dark:text-zinc-400">in</span>
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
    </div>
  )
}
