export default async function LoadingSection() {
  const title = 'Loading section'

  return (
    <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <div className="h-6 w-60 animate-pulse rounded-xs bg-zinc-300 dark:bg-zinc-700">
        <span className="sr-only">{title}</span>
      </div>
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
    </section>
  )
}
