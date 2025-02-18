export default function GenderRatioMetadata({
  genderRate,
}: {
  genderRate: number
}) {
  const title = 'Gender ratio'

  if (genderRate === -1) {
    return (
      <div className="flex flex-col gap-2 rounded-lg p-4">
        <h2 className="text-sm/6 text-zinc-600 dark:text-zinc-400">{title}</h2>
        <p>Genderless</p>
      </div>
    )
  }

  // Gender ratio is presented as a multiple of 8.
  const maleRate = Math.fround((1 - genderRate / 8) * 100).toFixed(1)
  const femaleRate = Math.fround((genderRate / 8) * 100).toFixed(1)

  return (
    <div className="flex flex-col gap-2 rounded-lg">
      <h2 className="text-sm/6 text-zinc-600 dark:text-zinc-400">{title}</h2>
      <div className="flex flex-col">
        {/* Progress bar visualization */}
        <div className="mb-2 h-2 w-full max-w-36 overflow-hidden">
          <div className="relative h-full max-w-full bg-pink-300">
            <div
              className="absolute inset-0 h-full bg-white dark:bg-black"
              style={{ width: `calc(${maleRate}% + 1px)` }}
            ></div>
            <div
              className="absolute inset-0 h-full bg-blue-300"
              style={{ width: `calc(${maleRate}% - 1px)` }}
            ></div>
          </div>
        </div>
        <div className="flex gap-x-1">
          <span className="flex flex-row items-center gap-x-2 text-base font-light text-blue-800 dark:text-blue-200">
            <svg fill="currentColor" className="size-4">
              <path d="M9.5 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.707L9.871 6.836a5 5 0 1 1-.707-.707L13.293 2zM6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8" />
            </svg>
            <p>{maleRate}</p>
          </span>
          <span className="text-base text-zinc-600 dark:text-zinc-400">%</span>
        </div>
        <div className="flex gap-x-1">
          <span className="flex flex-row items-center gap-x-2 text-base font-light text-pink-800 dark:text-pink-200">
            <svg fill="currentColor" className="size-4">
              <path d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13h-2a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5" />
            </svg>
            <p>{femaleRate}</p>
          </span>
          <span className="text-base text-zinc-600 dark:text-zinc-400">%</span>
        </div>
      </div>
    </div>
  )
}
