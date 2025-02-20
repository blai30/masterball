'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { Accessibility, Backpack, Cat, Swords } from 'lucide-react'

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
  { label: 'Pokemon', url: '/', icon: <Cat size={20} /> },
  { label: 'Items', url: '/item', icon: <Backpack size={20} /> },
  { label: 'Moves', url: '/move', icon: <Swords size={20} /> },
  { label: 'Abilities', url: '/ability', icon: <Accessibility size={20} /> },
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
    <nav className="container mx-auto px-4">
      <div className="flex flex-row flex-wrap items-center justify-between gap-4 py-3">
        <ul className="flex flex-row flex-wrap items-center gap-4">
          {navItems.map((item) => {
            const active = isActiveRoute(item.url)
            return (
              <li key={item.url} className="relative">
                {active && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 -z-10 rounded-lg bg-white/50 dark:bg-black/50"
                  />
                )}
                <Link
                  href={item.url}
                  className={clsx(
                    'inline-flex items-center gap-2 rounded-lg px-3 py-2',
                    'font-medium transition-colors hover:duration-0',
                    !active &&
                      'text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800 focus-visible:bg-zinc-200 focus-visible:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:focus-visible:bg-zinc-800 dark:focus-visible:text-zinc-200'
                  )}
                >
                  {item.icon}
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
