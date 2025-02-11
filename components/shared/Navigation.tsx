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
    <nav className="flex flex-row gap-4">
      <Link href="/">
        <p className="text-blue-700 underline dark:text-blue-300">Home</p>
      </Link>
      <Link href="https://github.com/blai30/masterball">
        <p className="text-blue-700 underline dark:text-blue-300">GitHub</p>
      </Link>
      <ThemeSwitch />
      <GlobalIndexSearch />
    </nav>
  )
}
