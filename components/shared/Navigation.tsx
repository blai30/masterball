'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const ThemeSwitch = dynamic(() => import('@/components/shared/ThemeSwitch'), {
  ssr: false,
})

const GlobalIndexSearch = dynamic(
  () => import('@/components/shared/GlobalIndexSearch'),
  {
    ssr: false,
  }
)

export default function Navigation() {
  return (
    <nav className="flex flex-row flex-wrap gap-4">
      <Link href="/">
        <p className="text-blue-700 underline dark:text-blue-300">Home</p>
      </Link>
      <Link href="/type">
        <p className="text-blue-700 underline dark:text-blue-300">Types</p>
      </Link>
      <Link href="/ability">
        <p className="text-blue-700 underline dark:text-blue-300">Abilities</p>
      </Link>
      <Link href="/move">
        <p className="text-blue-700 underline dark:text-blue-300">Moves</p>
      </Link>
      <Link href="/egg-group">
        <p className="text-blue-700 underline dark:text-blue-300">Egg Groups</p>
      </Link>
      <Link href="/damage-class">
        <p className="text-blue-700 underline dark:text-blue-300">Damage Classes</p>
      </Link>
      <Link href="https://github.com/blai30/masterball">
        <p className="text-blue-700 underline dark:text-blue-300">GitHub</p>
      </Link>
      <ThemeSwitch />
      <GlobalIndexSearch />
    </nav>
  )
}
