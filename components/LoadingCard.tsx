export default function LoadingCard() {
  const id = 0

  return (
    <div className="group from-50 flex flex-col items-center justify-between overflow-hidden rounded-l-sm rounded-tr-sm rounded-br-xl bg-gradient-to-br to-zinc-100 to-75% ring-1 ring-zinc-200 transition-colors hover:from-zinc-200 hover:to-zinc-100 hover:ring-zinc-300 hover:duration-0 focus-visible:from-zinc-100 focus-visible:to-zinc-200 focus-visible:ring-zinc-300 dark:from-zinc-900 dark:to-zinc-950 dark:ring-zinc-800 dark:hover:from-zinc-900 dark:hover:to-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:from-zinc-900 dark:focus-visible:to-zinc-800 dark:focus-visible:ring-zinc-700">
      <div className="flex flex-col items-center justify-between gap-2 p-2">
        <p
          aria-hidden="true"
          className="font-num text-sm text-zinc-400 dark:text-zinc-500"
        >
          {id}
        </p>
        <div className="w-full py-1">
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
    </div>
  )
}
