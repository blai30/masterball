export default function CaptureRateMetadata({
  captureRate,
}: {
  captureRate: number
}) {
  const title = 'Capture rate'

  const captureProbability = (captureRate: number) => {
    const a = captureRate / 3
    const captureValue = 65535 / Math.pow(255 / a, 0.1875)
    const captureProbability = Math.pow(captureValue / 65535, 4)
    return Math.fround(captureProbability) * 100
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg p-4">
      <h2 className="text-sm/6 text-zinc-600 dark:text-zinc-400">{title}</h2>
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
          <span className="text-base text-zinc-600 dark:text-zinc-400">%</span>
        </p>
      </div>
    </div>
  )
}
