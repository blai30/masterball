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

const links = [
  { href: '/', label: 'Pokemon' },
  { href: '/item', label: 'Items' },
  { href: '/type', label: 'Types' },
  { href: '/ability', label: 'Abilities' },
  { href: '/move', label: 'Moves' },
  { href: '/egg-group', label: 'Egg Groups' },
  { href: '/damage-class', label: 'Damage Classes' },
]

export default function Navigation() {
  return (
    <nav className="container mx-auto">
      <div className="flex flex-row flex-wrap gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            {link.label}
          </Link>
        ))}
        <ThemeSwitch />
        <GlobalIndexSearch />
      </div>
    </nav>
  )
}
