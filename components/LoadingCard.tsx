import GlassCard from '@/components/GlassCard'

export default function LoadingCard() {
  const id = 0

  return (
    <GlassCard variant="link" className="h-full">
      <div className="group flex flex-col items-center justify-between px-2 py-3">
        <p
          aria-hidden="true"
          className="font-num text-sm text-zinc-400 dark:text-zinc-500"
        >
          {id}
        </p>
        <div className="flex flex-col items-center py-1">
          <svg
            className="animate-spin p-6"
            viewBox="0 0 64 64"
            fill="none"
            width={128}
            height={128}
          >
            <path
              d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-zinc-300 dark:text-zinc-700"
            />
          </svg>
        </div>
        <h3 className="animate-pulse rounded-xs bg-zinc-300 px-4 text-base font-medium text-transparent select-none dark:bg-zinc-700">
          Loading...
        </h3>
      </div>
    </GlassCard>
  )
}
