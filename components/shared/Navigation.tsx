'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { Cat } from 'lucide-react'

const ThemeSwitch = dynamic(() => import('@/components/shared/ThemeSwitch'), {
  ssr: false,
})

const GlobalIndexSearch = dynamic(
  () => import('@/components/shared/GlobalIndexSearch'),
  {
    ssr: false,
  }
)

const navItems = [
  { label: 'Pokemon', url: '/' },
  { label: 'Items', url: '/item' },
  { label: 'Moves', url: '/move' },
  { label: 'Abilities', url: '/ability' },
  // { label: 'Types', url: '/type' },
  // { label: 'Egg Groups', url: '/egg-group' },
  // { label: 'Damage Classes', url: '/damage-class' },
]

export default function Navigation() {
  const pathname = usePathname()

  const isActiveRoute = (url: string) => {
    if (url === '/') {
      return (
        pathname === '/' ||
        (pathname.startsWith('/') &&
          !navItems.slice(1).some((item) => pathname.startsWith(item.url)))
      )
    }

    return pathname.startsWith(url)
  }

  return (
    <nav className="container mx-auto">
      <div className="flex flex-row flex-wrap items-center justify-between">
        <ul className="flex flex-row flex-wrap items-center gap-4">
          {navItems.map((item) => {
            const active = isActiveRoute(item.url)
            return (
              <li
                key={item.url}
                className={clsx(
                  'group inline-flex rounded-lg transition-colors hover:duration-0',
                  active
                    ? 'bg-zinc-300 dark:bg-zinc-700'
                    : 'hover:bg-zinc-200 focus-visible:bg-zinc-200 dark:hover:bg-zinc-800 dark:focus-visible:bg-zinc-800'
                )}
              >
                <Link
                  href={item.url}
                  className={clsx(
                    'inline-flex items-center gap-2 px-3 py-2',
                    'font-medium transition-colors group-hover:duration-0',
                    active
                      ? 'text-black dark:text-white'
                      : 'text-zinc-600 group-hover:text-zinc-800 group-focus-visible:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200 dark:group-focus-visible:text-zinc-200'
                  )}
                >
                  <Cat size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
        <ul className="flex flex-row flex-wrap items-center gap-4">
          <li>
            <GlobalIndexSearch />
          </li>
          <li>
            <ThemeSwitch />
          </li>
        </ul>
      </div>
    </nav>
  )
}
