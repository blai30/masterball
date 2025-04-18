export default async function LoadingSection() {
  return (
    <section className="flex flex-col gap-4">
      <svg
        className="animate-spin p-2"
        viewBox="0 0 64 64"
        fill="none"
        width={96}
        height={96}
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
