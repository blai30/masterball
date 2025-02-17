'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

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
      <div className="flex flex-row items-center justify-between">
        <ul className="flex flex-row items-center gap-4">
          {navItems.map((item) => {
            const active = isActiveRoute(item.url)
            return (
              <li
                key={item.url}
                className={clsx(
                  'group inline-flex border-b-2',
                  active
                    ? 'border-black dark:border-white'
                    : 'border-transparent hover:border-zinc-600 focus-visible:border-zinc-600 dark:hover:border-zinc-400 dark:focus-visible:border-zinc-400'
                )}
              >
                <Link
                  href={item.url}
                  className="inline-flex w-24 items-center justify-center py-2"
                >
                  <span
                    className={clsx(
                      'font-medium',
                      active
                        ? 'text-black dark:text-white'
                        : 'text-zinc-600 group-hover:text-zinc-800 group-focus-visible:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200 dark:group-focus-visible:text-zinc-200'
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
        <ul className="flex flex-row items-center gap-4">
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
